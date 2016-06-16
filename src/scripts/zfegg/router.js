define(['kendo', './ui/view/login'], function(kendo) {
    var router = new kendo.Router({
        routeMissing: function(e) {
            this.replace('/');
        }
    });

    router.start();

    return router;
});