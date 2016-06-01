define('zfegg/ui/init',
    [
        'jquery',
        'kendo',
        'zfegg/config',
        'zfegg/router',
        '../service/oauth',
        './view/login'
    ], function ($, kendo, config, router, oauth, LoginView) {
        'use strict';

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

        router.route('/', function () {
            require(['zfegg/ui/controller/layout'], function (LayoutCtrl) {
                LayoutCtrl.home();
            });
        });

        router.bind("change", function(e) {
            if (e.url == '/login') {
                return ;
            }
            if (!oauth.isLogin()) {
                e.preventDefault();
                router.replace("/login");
            }
        });

        router.start();
        document.title = config.title;

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
    });