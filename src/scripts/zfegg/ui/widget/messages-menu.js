define('zfegg/ui/widget/messages-menu',
    ['text!./messages-menu.html', 'jquery', 'kendo', './base-menu'],
    function (tpl, $, kendo, baseMenu) {
        return baseMenu({
            class: 'messages-menu',
            tpl: tpl,
            name: 'MessagesMenu'
        });
    });