const Koa = require("koa");
const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const Static = require("koa-static");
const ReactDOMServer = require("react-dom/server");
const app = new Koa();
const router = new Router();
let serverEntry;
let createApp;
let template;
let readyRender;

const isProd = process.env.NODE_ENV === "production";
if (isProd) {
    serverEntry = require("../dist/entry-server");
    createApp = serverEntry.createApp;
    template = fs.readFileSync("./dist/index.html", "utf-8");
    // 静态资源映射到dist路径下
    app.use(Static(path.join(__dirname, "../dist")));

} else {
    // 非生产环境使用webpack - dev - middleware和webpack - hot - middleware进行热更新
    readyRender = require("./setup-dev-server")(app, (entry, htmlTemplate) => {
        serverEntry = entry;
        createApp = serverEntry.createApp;
        template = htmlTemplate;
    });
}
/* eslint-disable no-console */
const render = async (ctx, next) => {
    console.log("visit url: " + ctx.url);
    //防止koa自动处理response, 我们要直接把react stream pipe到ctx.res
    // ctx.respond = false;
    // let context = {};

    // const templateArr = template.split('<!--react-ssr-outlet-->')
    // const beforeHtml = templateArr[0]
    // const afterHtml = templateArr[1]
    // ctx.res.write(beforeHtml);

    // let component = createApp(context, ctx.url);
    // const stream = ReactDOMServer.renderToNodeStream(component);
    // console.log(stream)
    // stream.pipe(ctx.res, {
    //     end: false
    // });

    // //监听react stream的结束，然后把后面剩下的html写进html document
    // stream.on('end', () => {
    //     ctx.res.write(afterHtml);
    //     console.log(ctx.res);
    //     ctx.res.end();
    // });
    // 使用renderToString
    let context = {};
    let component = createApp(context, ctx.url);
    let html = ReactDOMServer.renderToString(component);
    console.log(context)
    if (context.url) {
        ctx.status = 301;
        ctx.redirect(context.url);
    }

    if (context.status) { //未匹配到路由时
        ctx.status = context.status;
    }
    let htmlStr = template.replace("<!--react-ssr-outlet-->", `${html}`);
    ctx.body = htmlStr;
}
router.get('*', isProd ? render : (ctx, next) => {
    // 等待客户端和服务端打包完成后进行render
    readyRender.then(() => render(ctx, next));
})
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000, () => {
    console.log("Your app is running");
});