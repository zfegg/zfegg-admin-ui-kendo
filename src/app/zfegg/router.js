define('zfegg/router', ['kendo'], function($) {

    return new kendo.Router({
        routeMissing: function(e) {
            console.log('Route missing', e.url, e.params);
        }
    });
});