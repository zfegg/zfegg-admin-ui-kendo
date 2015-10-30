define('zfegg/admin/controller/resource',
    [
        'require',
        'zfegg/model/view',
        'zfegg/config',
        '../source/resources'
    ],
    function (req, View, config, resources) {
        'use strict';

        return new View(
            '资源管理',
            req.toUrl('./resource.html'),
            {
                model: {
                    dataSource: resources
                }
            }
        );
    });