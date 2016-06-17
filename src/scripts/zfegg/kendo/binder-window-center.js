define(['kendo'], function(kendo) {
    kendo.data.binders.widget.center = kendo.data.Binder.extend({
        init: function(element, bindings, options) {
            kendo.data.Binder.fn.init.call(this, element, bindings, options);
            element.center();
        },
        refresh: function() {
        }
    });
});