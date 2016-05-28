define('zfegg/ui/view/layout', ['text!./layout.html', 'jquery', 'kendo', '../widget/sidebar-menu'], function (tpl, $, kendo) {
    return kendo.View.extend({
        init: function(options) {
            var that = this;
            kendo.View.fn.init.call(that, tpl, $.extend({
                model: {
                    menus: []
                },
                evalTemplate: true
            }, options));
        },
        error: function (msg) {
            this.trigger('loginError', msg);
        }
    });
});