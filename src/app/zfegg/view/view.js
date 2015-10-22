define('zfegg/view/view', ['jquery', 'kendo'], function($, kendo) {
    var View = function (title, tmpl, renderOptions) {
        var defaults = {
            title: '',
            tmpl: '',
            renderOptions: {}
        };

        if (typeof tmpl == 'object') {
            this.options = $.extend(defaults, tmpl);
        } else {
            this.options = {
                title: title,
                tmpl: tmpl,
                renderOptions: renderOptions
            };
        }

        this.title = this.options.title;
    };

    View.prototype.render = function (onRender) {
        var opts = this.options,
            self = this,
            callback =  function (html){
                var view = new kendo.View(html, opts.renderOptions);
                var elem = view.render();
                self.kendoView = view;
                if (onRender) onRender(elem, view);
            };

        if (window.templates && window.templates[opts.tmpl]) {
            setTimeout(function () {
                callback(window.templates[opts.tmpl]);
            }, 0);
        } else {
            $.get(opts.tmpl, callback);
        }
    };

    return View;
});