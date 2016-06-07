define('zfegg/ui/widget/common-grid', ['kendo', 'jquery', 'zfegg/ui/notification'], function (kendo, $, notification) {


        var ui = kendo.ui,
            Widget = ui.Grid;

        var Messages = Widget.extend({
            init: function(element, options) {
                var that = this;
                Widget.fn.init.call(that, element, options);
            },
            options: {
                name: 'CommonGrid'
            },
            _toolbar: function () {
                var that = this,
                    wrapper = that.wrapper,
                    toolbarOptions = that.options.toolbar,
                    $toolbar = that.wrapper.find(".k-grid-toolbar");

                Widget.fn._toolbar.call(that);

                $.each(toolbarOptions, function (i, o) {
                    var name = o.name || o.text,
                        eventName = 'click.'+name;

                    if (o.hasOwnProperty('clickAndPostUrl')) {
                        var url = o.clickAndPostUrl;
                        that.element.bind(eventName, function (e, node, row) {
                            var data = node.toJSON();
                            $.each(data, function (key, val) {
                                url = url.replace('{'+key+'}', val);
                            });

                            $.ajax({
                                url: url,
                                data: JSON.stringify(data),
                                type: 'POST',
                                contentType: 'application/json',
                                success: function (result) {
                                    notification.success(result.message || "OK");
                                }
                            });
                        });
                    }

                    if (typeof o == 'object' && o.hasOwnProperty('click')) {
                        that.element.bind(eventName, o.click);
                    }

                    $toolbar.on('click.k-grid-toolbar', '.k-grid-' + name, function () {
                        var row = that.select();
                        var data = that.dataItem(row);
                        that.element.trigger(eventName, [data, row]);
                    });
                });
            }
        });

        ui.plugin(Messages);

        return Messages;
});