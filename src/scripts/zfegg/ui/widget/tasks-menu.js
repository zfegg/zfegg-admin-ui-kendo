define(
    ['text!./tasks-menu.html', 'jquery', 'kendo', './base-menu'],
    function (tpl, $, kendo, baseMenu) {
        return baseMenu({
            class: 'tasks-menu',
            tpl: tpl,
            name: 'TasksMenu'
        });
    });