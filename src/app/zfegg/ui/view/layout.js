define('zfegg/ui/view/layout', ['text!./login.html', 'jquery'], function (tpl, $) {
    return kendo.View.extend({
        init: function(options) {
            var that = this;
            kendo.View.fn.init.call(that, [tpl, $.extend({
                model: {
                    onSubmit: function (e) {
                        e.preventDefault();
                        that.trigger('loginSubmit', [e.target]);
                    }
                }
            }, options)]);

            that.bind(['loginSubmit'], options);
            that.bind(['loginError'], function (e, msg) {
                $('<div></div>').kendoNotification({
                    appendTo: this.element,
                    autoHideAfter: 1500
                }).data('kendoNotification').error(msg);
            });
        },
        error: function (msg) {
            this.trigger('loginError', msg);
        }
    });
});