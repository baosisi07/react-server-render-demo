const React = require("react");
const ReactDOMServer = require("react-dom/server");
const {
    ChunkExtractor,
    ChunkExtractorManager
} = require("@loadable/server");

class ServerRenderer {
    constructor(bundle, template, client) {
        this.template = template;
        this.client = client;
        this.serverEntry = this._createEntry(bundle);
    }
    renderToString(request) {
        return new Promise((resolve, reject) => {
            const serverEntry = this.serverEntry;

            const createApp = serverEntry.createApp;
            const renderFun = () => {
                // 存放组件内部路由相关属性，包括状态码，地址信息，重定向的url
                let context = {};

                let component = createApp(context, request.url);
                let extractor = new ChunkExtractor({
                    stats: this.client,
                    entrypoints: ["app"] // 入口entry
                });
                let root = ReactDOMServer.renderToString(
                    React.createElement(
                        ChunkExtractorManager, {
                            extractor
                        },
                        component)
                );

                if (context.url) { // 当发生重定向时，静态路由会设置url
                    resolve({
                        error: {
                            url: context.url
                        }
                    });
                    return;
                }

                if (context.statusCode) { // 有statusCode字段表示路由匹配失败
                    resolve({
                        error: {
                            code: context.statusCode
                        }
                    });
                } else {
                    // store.getState() 获取预加载的state，供客户端初始化
                    resolve({
                        error: undefined,
                        html: this._generateHTML(root, extractor)
                    });
                }
            }
            renderFun();
        });
    }
    _createEntry(bundle) {
        const file = bundle.files[bundle.entry];

        // 读取内容并编译模块
        const vm = require("vm");
        const sandbox = {
            console,
            module,
            require
        };
        vm.runInNewContext(file, sandbox);

        return sandbox.module.exports;
    }
    _generateHTML(html, webExtractor) {
        // 替换注释节点为渲染后的html字符串
        return this.template
            .replace("<!--react-ssr-head-->",
                `${webExtractor.getLinkTags()}\n${webExtractor.getStyleTags()}`).replace("<!--react-ssr-outlet-->", `${html}\n${webExtractor.getScriptTags()}`);
    }
}

module.exports = ServerRenderer;