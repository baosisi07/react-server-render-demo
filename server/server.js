const Koa = require("koa");
const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const Static = require("koa-static");
const ServerRenderer = require("./render");
const app = new Koa();
const router = new Router();

let renderer;
let readyRender;
let template = fs.readFileSync("./index.html", "utf-8");

const isProd = process.env.NODE_ENV === "production";
if (isProd) {
    let server = path.resolve(
        __dirname, '../dist/server.json')
    let client = path.resolve(
        __dirname, "../dist/client.json")

    // 静态资源映射到dist路径下
    app.use(Static(path.join(__dirname, "../dist")));
    renderer = new ServerRenderer(server, template, client);

} else {
    // 非生产环境使用webpack - dev - middleware和webpack - hot - middleware进行热更新
    readyRender = require("./setup-dev-server")(app, (server, client) => {
        renderer = new ServerRenderer(server, template, client);
    });
}
app.use(Static(path.join(__dirname, "../public")));

/* eslint-disable no-console */
const render = async (ctx, next) => {

    renderer.renderToString(ctx).then(({
        error,
        html
    }) => {
        if (error) {
            if (error.url) {
                ctx.redirect(error.url);
            } else if (error.code) {
                ctx.status = error.code
                ctx.body = "error code：" + error.code
            }
        }
        ctx.body = html
    }).catch(error => {
        console.log(error);
        ctx.status = 500
        ctx.body = "Internal server error"
    });

}
router.get('*', isProd ? render : (ctx, next) => {
    // 等待客户端和服务端打包完成后进行render
    readyRender.then(() => render(ctx, next));
})
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
    console.log("Your app is running");
});