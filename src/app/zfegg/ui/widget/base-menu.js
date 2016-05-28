define('zfegg/ui/widget/base-menu', ['kendo'], function (kendo) {
    return function (config) {
        var ui = kendo.ui,
            Widget = ui.DataBoundWidget;

        var Messages = Widget.extend({
            init: function(element, options) {
                var that = this;
                Widget.fn.init.call(that, element, options);

                that.element.addClass(config.class);
                that.template = kendo.template(config.tpl);

                that.dataSource = kendo.data.DataSource.create(options.dataSource || []);
                that.dataSource.bind("change", function() {
                    that.refresh();
                });
                that.dataSource.fetch();
            },
            options: {
                name: config.name
            },
            refresh: function() {
                var that = this,
                    view = that.dataSource.view(),
                    html = that.template({data: view});

                that.element.html(html);
            }
        });

        ui.plugin(Messages);

        return Messages;
    };
});