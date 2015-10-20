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
        var opts = this.options;
        var self = this;

        $.get(opts.tmpl, function (html){
            var view = new kendo.View(html, opts.renderOptions);
            var elem = view.render();
            self.kendoView = view;
            onRender && onRender(elem, view);
        });
    };

    return View;
});