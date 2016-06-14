define('zfegg/admin/source/roles',
    [
        'jquery',
        'kendo',
        'zfegg/config',
        'zfegg/kendo/restful-data-source'
    ],
    function($, kendo, config, Restful) {
    'use strict';

        var restUrl = config.baseUrl + '/roles';
        var dataSource = new Restful({
            url: restUrl,
            schema: {
                model: {
                    id: "role_id",
                    fields: {
                        role_id: {type: "number", editable: false, nullable: true},
                        name: {validation: {required: true}},
                        parent_id: {validation: {required: true}}
                    }
                }
            }
        });

        var flatData = [];
        var hierarchicalDataSource = new kendo.data.HierarchicalDataSource({
            transport:  {
                read: function(options) {
                    var id = options.data.role_id || 0;

                    dataSource.promise().then(function () {
                        flatData = dataSource.data().toJSON();
                        options.success($.grep(flatData, function(x) {
                            return x.parent_id == id;
                        }));
                    });
                }
            },
            schema: {
                parse: function(response) {
                    return $.map(response, function(x) {
                        x.expanded = true;
                        return x;
                    });
                },
                model: {
                    id: "role_id",
                    hasChildren: function(x) {
                        var id = x.role_id;

                        for (var i = 0; i < flatData.length; i++) {
                            if (flatData[i].parent_id == id) {
                                return true;
                            }
                        }
                        return false;
                    }
                }
            }
        });

        return {
            dataSource: dataSource,
            hierarchicalDataSource: hierarchicalDataSource
        };
});