define('zfegg/router', ['kendo', './ui/view/login'], function(kendo) {
    return new kendo.Router({
        routeMissing: function(e) {
            console.log('Route missing', e.url, e.params);
        }
    });
});