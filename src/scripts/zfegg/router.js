define(['kendo', './ui/view/login'], function(kendo) {
    var router = new kendo.Router({
        routeMissing: function(e) {
            console.log('Missing route: ' + e.url);
        }
    });
    return router;
});