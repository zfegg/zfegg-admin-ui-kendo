define('zfegg/ui/init',
    [
        'jquery',
        'kendo',
        'zfegg/config',
        'zfegg/router',
        './tabs'
    ], function($, kendo, config, router, $tabs) {
    'use strict';

    var $panel = $("body div[data-role=panelbar]");
    $tabs.push($("body [data-role=tabstrip]").get(0));

    var viewModel = kendo.observable({
        onSelectPanel: function(e) {
            e.preventDefault();
            console.log('onSelectPanel');
        },
        onSelectTabstrip: function(e) {
            console.log('onSelectTabstrip');
        }
    });
    kendo.bind(document.body, viewModel);

    //左侧菜单加载
    var url = config.baseUrl;
    $.get(url + "/profile/menus", function (items) {
        $panel.data('kendoPanelBar').append(items);
    });

    //Ajax 网络状态监听
    $.ajaxSetup({
        error: function (xhr) {
            if (xhr.responseJSON) {
                require(['./notification'], function (notification) {
                    notification.error('<span>错误('+ xhr.status +'): '+xhr.statusText + '</span><br />'+xhr.responseJSON.detail);
                });
            }
        }
    });
});