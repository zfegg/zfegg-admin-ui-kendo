define(['require', 'kendo', 'jquery', './ui/view/layout', './router', './ui/init'], function (require, kendo, $, LayoutView, router) {
    var Application = kendo.Class.extend({
        init: function (options) {
            this.router = router;
            this.layout = new LayoutView({
                model: {
                    menus: options.menusDataSource
                }
            });

            this.layout.render(options.renderElement);

            require('zfegg/ui/init');
        },
        loadModules: function (modules) {
            var self = this;
            $.each(modules || [], function (module) {
                require(module, function (call) {
                    call && call(self);
                });
            });
        }
    });

    return Application;
});
