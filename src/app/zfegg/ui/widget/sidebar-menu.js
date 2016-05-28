define('zfegg/ui/widget/sidebar-menu',
    ['text!./sidebar-menu.html', 'jquery', 'kendo', './base-menu'],
    function (tpl, $, kendo, baseMenu) {
        return baseMenu({
            class: 'sidebar-menu',
            tpl: tpl,
            name: 'SidebarMenu'
        });
    });