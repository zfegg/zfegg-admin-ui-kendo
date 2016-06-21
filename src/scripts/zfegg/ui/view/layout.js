define(['text!./layout.html', 'jquery', 'kendo', '../widget/sidebar-menu'], function (tpl, $, kendo) {
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
                evalTemplate: true,
                wrap: false
            }, options);

            kendo.View.fn.init.call(that, tpl, options);
        },
        error: function (msg) {
            this.trigger('loginError', msg);
        },
        cachedContents: {},
        renderContent: function (options) {
            var that = this, content;
            options = $.extend({
                title: '',
                subTitle: '',
                breadcrumb: [],
                content: ''
            }, options);

            this.element.find('.content-header h1').html(options.title + '<small>' + options.subTitle + '</small>');
            var $ol = this.element.find('.content-header .breadcrumb').empty();
            $.each(options.breadcrumb, function (i, o) {
                $ol.append('<li>'+o.text+'</li>');
            });

            var $content = this.element.find('section.content');
            $content.children().detach();

            $content.append(options.content);
        }
    });
});