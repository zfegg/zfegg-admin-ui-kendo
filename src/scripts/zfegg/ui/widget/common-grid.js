define(['kendo', 'jquery', 'zfegg/ui/notification'], function (kendo, $, notification) {


        var ui = kendo.ui,
            Widget = ui.Grid;

        var ZfeggCommonGrid = Widget.extend({
            init: function(element, options) {
                var that = this;
                Widget.fn.init.call(that, element, options);

                if (this.options.resizeFullHeight) {
                    var windowResizeHandler = function () {
                        var $body = $('body');
                        var wrapper = $body.find('.content-wrapper');
                        var contentWrapperHeight = $(window).height()-$body.find('.main-header').height();
                        var contentHeaderHeight = wrapper.find('.content-header').outerHeight();
                        var contentOuterHeight = wrapper.find('.content').outerHeight()-wrapper.find('.content').height();
                        var height = contentWrapperHeight-contentHeaderHeight-contentOuterHeight-2;//-2 可能因计算四舍五入出现多于高度

                        that.wrapper.height(height);
                        that.resize(true);
                    };

                    $(window).bind('resize', windowResizeHandler);
                    windowResizeHandler();
                }
            },
            options: {
                name: 'ZfeggCommonGrid',
                resizeFullHeight: false,
                pageable: {
                    refresh: true,
                    buttonCount: 5
                },

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

        ui.plugin(ZfeggCommonGrid);

        return ZfeggCommonGrid;
});