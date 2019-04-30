// 开发环境打包服务
const path = require('path');
const webpack = require("webpack");
const clientConfig = require("../build/webpack.client.conf");


const MFS = require("memory-fs");
const serverConfig = require("../build/webpack.server.conf");

module.exports = (app, callback) => {
    let serverEntry;
    let template;
    let resolve;
    const readyPromise = new Promise(r => {
        resolve = r
    });
    const update = () => {
        if (serverEntry && template) {
            callback(serverEntry, template);
            resolve();
        }
    }
    const readFile = (fs, fileName) => {
        return fs.readFileSync(path.join(clientConfig.output.path, fileName), "utf-8");
    }
    // 修改入口文件，增加热更新文件
    clientConfig.entry.app = ["webpack-hot-middleware/client", clientConfig.entry.app];
    clientConfig.output.filename = "dist/js/[name].[hash:8].js";
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    // 客户端打包
    const clientCompiler = webpack(clientConfig);
    const devMiddleware = require("koa-webpack-dev-middleware")(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        noInfo: true
    });
    // 使用webpack-dev-middleware中间件服务webpack打包后的资源文件
    app.use(devMiddleware);

    clientCompiler.hooks.done.tap('done', stats => {
        const info = stats.toJson();
        if (stats.hasWarnings()) {
            console.warn(info.warnings);
        }

        if (stats.hasErrors()) {
            console.error(info.errors);
            return;
        }
        // 从webpack-dev-middleware中间件存储的内存中读取打包后的inddex.html文件模板
        template = readFile(devMiddleware.fileSystem, "index.html");
        update();
    });
    // 热更新中间件
    app.use(require("koa-webpack-hot-middleware")(clientCompiler));

    // 监视服务端打包入口文件，有更改就更新
    const serverCompiler = webpack(serverConfig);
    // 使用内存文件系统
    const mfs = new MFS();
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({}, (err, stats) => {
        const info = stats.toJson();
        if (stats.hasWarnings()) {
            console.warn(info.warnings);
        }

        if (stats.hasErrors()) {
            console.error(info.errors);
            return;
        }

        // 读取打包后的内容并编译模块
        const bundle = readFile(mfs, "entry-server.js");
        const m = new module.constructor();
        m._compile(bundle, "entry-server.js");
        serverEntry = m.exports;
        update();
    });

    return readyPromise;
}