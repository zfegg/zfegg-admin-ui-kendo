define(['text!./login.html', 'jquery', 'kendo'], function (tpl, $, kendo) {
    'use strict';

    return kendo.View.extend({
        init: function(options) {
            var that = this;
            kendo.View.fn.init.call(that, tpl, $.extend({
                model: {
                    onSubmit: function (e) {
                        e.preventDefault();
                        that.trigger('loginSubmit', e);
                    }
                }
            }, options));

            that.bind(['loginSubmit'], options);
            that.bind('loginError', function (e, msg) {
                $('<div></div>').kendoNotification({
                    appendTo: this.element,
                    autoHideAfter: 1500
                }).data('kendoNotification').error(msg);
            });
            that.bind('init', function () {
                $(document.body).addClass('hold-transition login-page');
            });
        },
        error: function (msg) {
            this.trigger('loginError', msg);
        },
        destroy: function () {
            $(document.body).removeClass('hold-transition login-page');
            kendo.View.fn.destroy.call(this);
        }
    });
});