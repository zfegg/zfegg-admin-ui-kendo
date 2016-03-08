define('zfegg/ui/init',
    [
        'require',
        'jquery',
        'kendo',
        'zfegg/model/view',
        'zfegg/config',
        'zfegg/router',
        './tabs',
        '../service/oauth'
    ], function (req, $, kendo, View, config, router, $tabs, oauth) {
        'use strict';

        var renderAdminView = function () {
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
        };

        var renderLoginView = function () {
            var $login = $('#zfegg-login');
            var loginModel = kendo.observable({
                isVisible: true,
                onSubmit: function (e) {
                    e.preventDefault();
                    oauth.login({
                        username: e.target.username.value,
                        password: e.target.password.value
                    });
                    return false;
                }
            });
            oauth.bind('login.success', function () {
                loginModel.set('isVisible', false);
                renderAdminView();
            }).bind('login.error', function (xhr) {
                var msg = '登录错误';
                if (/application\/[\w\+]*json/.test(xhr.getResponseHeader('Content-Type')) && xhr.responseJSON && xhr.responseJSON.detail) {
                    msg = xhr.responseJSON.detail;
                } else {
                    msg = xhr.status + ' ' + xhr.statusText;
                }

                $('<div></div>').kendoNotification({
                    appendTo: $login,
                    autoHideAfter: 1500
                }).data('kendoNotification').error(msg);
            });

            kendo.bind($login, loginModel);
            $login.show();
        };

        //Ajax 网络状态监听
        $.ajaxSetup({
            error: function (xhr) {
                console.log("error", xhr);

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

        if (!oauth.isLogin()) {
            renderLoginView();
        } else {
            renderAdminView();
        }

        document.title = config.title;

        if (location.hash.length > 1) {
            location.hash = '';
        }
    });