define(['text!./notifications-menu.html', 'jquery', 'kendo', './base-menu'],
    function (tpl, $, kendo, baseMenu) {
        return baseMenu({
            class: 'notifications-menu',
            tpl: tpl,
            name: 'NotificationsMenu'
        });
    });