define(
    [
        'kendo',
        'zfegg/config'
    ],
    function(kendo, config) {
        'use strict';

        var restUrl = config.baseUrl + '/menus.json';
        return new kendo.data.DataSource({
            transport: {
                read: {
                    url: restUrl
                }
            }
        });
    });