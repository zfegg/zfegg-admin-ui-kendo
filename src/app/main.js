requirejs.config({
    paths: {
        jquery: '../../node_modules/jquery/dist/jquery',
        kendo: '../../libs/kendo/js/kendo.web.min',
        base64: '../../node_modules/js-base64/base64',
        cookie: '../../node_modules/js-cookie/src/js.cookie',
        bootstrap: '../../node_modules/bootstrap/dist/js/bootstrap.min',
        'admin-lte': '../../node_modules/admin-lte/dist/js/app.min'
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

define(['jquery', 'admin-lte'], function ($) {
    //require(['zfegg/config'], function (config) {
    //    config = $.extend(config, zfeggConfig);
    //
    //    var modules = [
    //        'zfegg/router',
    //        'zfegg/ui/init',
    //        'zfegg/admin/init'
    //    ];
    //
    //    if (config.modules) {
    //        modules.concat(config.modules);
    //    }
    //
    //    if (config.requirejs_config) {
    //        requirejs.config(config.requirejs_config);
    //    }
    //
    //    require(modules, function (router) {
    //    });
    //});

    //Ajax ÍøÂç×´Ì¬¼àÌý
    $.ajaxSetup({
        error: function (xhr) {
            console.log("error", xhr);

            var msg = 'ÏµÍ³´íÎó';
            if (/application\/[\w\+]*json/.test(xhr.getResponseHeader('Content-Type')) && xhr.responseJSON && xhr.responseJSON.detail) {
                msg = '<span>´íÎó(' + xhr.status + '): ' + xhr.statusText + '</span><br />' + xhr.responseJSON.detail;
            } else {
                msg = msg + ': ' + xhr.status + ' ' + xhr.statusText;
            }

            require(['zfegg/ui/notification'], function (notification) {
                notification.error(msg);
            });
        }
    });
});