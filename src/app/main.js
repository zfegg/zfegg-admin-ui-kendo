requirejs.config({
    paths: {
        jquery: '../../node_modules/jquery/dist/jquery',
        kendo: '../../libs/kendo/js/kendo.web.min',
        base64: '../../node_modules/js-base64/base64',
        cookie: '../../node_modules/js-cookie/src/js.cookie',
        bootstrap: '../../node_modules/bootstrap/dist/js/bootstrap.min',
        'admin-lte': '../../node_modules/admin-lte/dist/js/app.min',
        text: '../../node_modules/text/text'
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

define(['jquery', 'zfegg/config',  'admin-lte'], function ($) {
    var modules = [
        'zfegg/ui/init',
        'zfegg/admin/init'
    ];

    require(modules, $.noop);
});