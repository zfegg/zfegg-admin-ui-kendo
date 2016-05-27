define('zfegg/ui/init',
    [
        'require',
        'jquery',
        'kendo',
        'zfegg/model/view',
        'zfegg/config',
        'zfegg/router',
        './tabs',
        '../service/oauth',
        './view/login'
    ], function (req, $, kendo, View, config, router, $tabs, oauth, LoginView) {
        'use strict';

        router.route('/login', function () {
            var view = new LoginView({
                loginSubmit: function () {
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
            var $panel = $("body div[data-role=panelbar]");
            $tabs.push($("body [data-role=tabstrip]").get(0));

            var viewModel = kendo.observable({
                onSelectPanel: function (e) {
                    e.preventDefault();
                    console.log('onSelectPanel');
                },
                onSelectTabstrip: function (e) {
                    console.log('onSelectTabstrip');
                }
            });

            kendo.bind($('#zfegg-admin').show(), viewModel);

            //左侧菜单加载
            var url = config.baseUrl;
            $.get(url + "/profile/menus", function (items) {
                $panel.data('kendoPanelBar').append(items._embedded.menus);
            });
        });

        router.navigate(oauth.isLogin() ? "/" : "/login");
        document.title = config.title;
    });