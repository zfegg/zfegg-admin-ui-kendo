requirejs.config({
    baseUrl: './scripts',
    paths: {
        requirejs: '../../node_modules/requirejs/require',
        jquery: '../../node_modules/jquery/dist/jquery',
        kendo: '../../libs/kendo/js/kendo.web.min',
        base64: '../../node_modules/js-base64/base64',
        cookie: '../../node_modules/js-cookie/src/js.cookie',
        bootstrap: '../../node_modules/bootstrap/dist/js/bootstrap.min',
        'admin-lte': '../../node_modules/admin-lte/dist/js/app.min',
        text: '../../node_modules/text/text',
    },
    shim: {
        'admin-lte': {
            deps:['jquery', 'bootstrap']
        },
        bootstrap: {
            deps:['jquery']
        }
    }
});
require(['zfegg/app', 'kendo'], function (Application, kendo) {
    var App = new Application({
        renderElement: document.body,
        menusDataSource: new kendo.data.DataSource({
            transport: {
                read: {
                    url: './data/menus.json'
                }
            }
        })
    });
    App.loadModules(

    );
});