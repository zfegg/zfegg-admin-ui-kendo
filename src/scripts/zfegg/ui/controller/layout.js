define([
    'zfegg/config',
    'zfegg/service/oauth',
    'zfegg/router',
    '../view/layout',
    '../source/menus',
    'zfegg/ui/notification'
], function (config, oauth, router, LayoutView, menus, notification) {

    var layout = new LayoutView({
        model: {
            menus: menus,
        }
    });
    layout.render(document.body);
    $(document.body).resize(); //Resize??

    return {
        home : function () {

        },

        view: function () {
            return layout;
        },

        notification: notification
    }
});