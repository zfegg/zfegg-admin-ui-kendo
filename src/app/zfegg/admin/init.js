define('zfegg/admin/init',
    [
        'zfegg/router',
        'zfegg/ui/tabs'
    ], function (router, $tabs) {
        'use strict';

        router.route('/zfegg/admin/:action', function (action) {
            $tabs.dispatchController('zfegg/admin/controller/' + action);
        });
    });

