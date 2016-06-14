define('zfegg/ui/source/menus',
    [
        'kendo',
        'zfegg/config'
    ],
    function(kendo, config) {
        'use strict';

        var restUrl = config.baseUrl + '/menus';
        return new kendo.data.DataSource({
            transport: {
                read: {
                    url: restUrl
                }
            }
        });
    });