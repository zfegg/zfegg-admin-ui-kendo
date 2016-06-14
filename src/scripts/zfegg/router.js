define(['kendo', './ui/view/login'], function(kendo) {
    return new kendo.Router({
        routeMissing: function(e) {
            this.replace('/');
        }
    });
});