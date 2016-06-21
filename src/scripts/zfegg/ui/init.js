define([
        'jquery',
        'kendo',
        'zfegg/config',
        'zfegg/router',
        './view/login',
        './widget/common-grid',
        'admin-lte'
    ], function ($, kendo, config, router, LoginView) {
    'use strict';

    //Ajax 网络状态监听
    $.ajaxSetup({
        error: function (xhr) {
            var msg = '系统错误';
            if (/application\/[\w\+]*json/.test(xhr.getResponseHeader('Content-Type')) && xhr.responseJSON && xhr.responseJSON.detail) {
                msg = '<span>错误(' + xhr.status + '): ' + xhr.statusText + '</span><br />' + xhr.responseJSON.detail;
            } else {
                msg = msg + ': ' + xhr.status + ' ' + xhr.statusText;
            }

            require(['zfegg/ui/notification'], function (notification) {
                notification.error(msg);
            });
        }
    });

    return function (App) {

        document.title = config.title;
        var oauth = App.oauth;

        App.router.route('/test', function () {
            var $elm = $('<div></div>');
            console.log('test', $elm);
            App.layout.renderContent({
                title: "Test",
                content:$elm
            });
            $elm.kendoZfeggCommonGrid({
                columns: [{
                    field: "name",// create a column bound to the "name" field
                    title: "Name" // set its title to "Name"
                }, {
                    field: "age",// create a column bound to the "age" field
                    title: "Age" // set its title to "Age"
                }],
                dataSource: [ { name: "Jane", age: 30 }, { name: "John", age: 33 }],
                toolbar: ["create"],
                fullHeight: true,
                resizeFullHeight: true
            });
        });

        router.route('/login', function () {
            var view = new LoginView({
                loginSubmit: function (e) {
                    oauth.login({
                        username: e.target.username.value,
                        password: e.target.password.value
                    });
                }
            });

            oauth.bind('login.success', function () {
                view.destroy();
                router.navigate("/");
            }).bind('login.error', function (xhr) {
                var msg = '登录错误';
                if (/application\/[\w\+]*json/.test(xhr.getResponseHeader('Content-Type')) && xhr.responseJSON && xhr.responseJSON.detail) {
                    msg = xhr.responseJSON.detail;
                } else {
                    msg = xhr.status + ' ' + xhr.statusText;
                }

                view.error(msg);
            });

            view.render(document.body);
        });

        router.bind("change", function(e) {
            if (e.url == '/login') {
                return ;
            }
            if (!oauth.isLogin()) {
                e.preventDefault();
                router.replace("/login");
            } else {
                App.initLayout();
            }
        });
    };
});