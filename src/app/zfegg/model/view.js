define('zfegg/model/view', ['jquery', 'kendo'], function($, kendo) {
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

    View.prototype.render = function (elem, onRender) {
        if (typeof elem == 'function') {
            onRender = elem;
            elem = undefined;
        }

        var opts = this.options,
            self = this,
            callback =  function (html){
                var view = new kendo.View(html, opts.renderOptions);
                var container = view.render(elem);
                self.kendoView = view;
                if (onRender) onRender(container, view);
            };

        var templateKey = opts.tmpl.replace(/^.\//, '');
        if (window.templates && window.templates[templateKey]) {
            setTimeout(function () {
                callback(window.templates[templateKey]);
            }, 0);
        } else {
            $.get(opts.tmpl, callback);
        }
    };

    return View;
});