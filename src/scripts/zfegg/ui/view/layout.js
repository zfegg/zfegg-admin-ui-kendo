define('zfegg/ui/view/layout', ['text!./layout.html', 'jquery', 'kendo', '../widget/sidebar-menu'], function (tpl, $, kendo) {
    return kendo.View.extend({
        init: function (options) {
            var that = this;
            options = $.extend({
                model: {
                    menus: []
                },
                init: function () {
                    $(document.body).resize();
                },
                evalTemplate: true
            }, options);

            kendo.View.fn.init.call(that, tpl, options);
        },
        error: function (msg) {
            this.trigger('loginError', msg);
        },
        renderContent: function (options) {
            var that = this;
            options = $.extend({
                title: null,
                subTitle: null,
                breadcrumb: [],
                content: null
            }, options);
            this.element.find('.content-header h1').html(options.title + '<small>' + options.subTitle + '</small>');
            var $ol = this.element.find('.content-header .breadcrumb').empty();
            $.each(options.breadcrumb, function (i, o) {
                $ol.append('<li>'+o.text+'</li>');
            });

            var $content = this.element.find('section.content');
            $content.child().hide();
            $content.append(options.content);
        }
    });
});