define('zfegg/admin/source/role-resources',
    [
        'jquery',
        'kendo',
        'zfegg/config',
        'zfegg/kendo/restful-data-source',
        './resources'
    ],
    function($, kendo, config, Restful, resources) {
        'use strict';

        var Assigner = function (role) {
            var self = this;
            var url = config.baseUrl + '/roles/' + role.role_id + '/resources';
            var assignerSource = new Restful({
                url:  url,
                schema: {
                    model: {
                        id: "id",
                        fields: {
                            id: {type: "number"},
                            resource: {editable: false},
                            description: {},
                            methods: {}
                        }
                    }
                }
            });

            var flatData = [];
            var hierarchicalDataSource = new kendo.data.HierarchicalDataSource({
                transport: {
                    read: function(options) {
                        var id = options.data.role_id || 0;

                        self.dataSource.promise().then(function () {

                            resources.promise().then(function () {
                                flatData = resources.data().toJSON();

                                $.map(flatData, function(x) {
                                    if (self.getByResource(x.resource)) {
                                        x.checked = true;
                                    }
                                    return x;
                                });
                                options.success($.grep(flatData, function(x) {
                                    return x.parent_id == id;
                                }));
                            });
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

            this.dataSource = assignerSource;
            this.hierarchicalDataSource = hierarchicalDataSource;
        };

        Assigner.prototype.assign = function (resourceSub) {
            var self = this;

            if (!resourceSub.method) {
                if (!resourceSub.items.length) {
                    resourceSub.load();
                }

                $.each(resourceSub.items, function (i, item) {
                    self.assign(item);
                });
                return;
            }

            var resourceItem = resourceSub.parent().parent();
            var actions = resourceItem.actions;

            if (resourceSub.checked) {
                $.each(actions, function (i, action) {
                    var name = resourceItem.resource + '::' + action;
                    var item = self.getByResource(name);

                    if (!item) {
                        item = self.dataSource.add({resource: name, methods: []});
                    }

                    item.methods.push(resourceSub.method);

                    if (resourceSub.method == 'PUT') {
                        item.methods.push('PATCH');
                    } else if (resourceSub.method == 'PATCH') {
                        item.methods.push('PUT');
                    }

                    item.set('methods', $.unique(item.methods));

                    console.log(item.methods);
                });
            } else {
                $.each(actions, function (i, action) {
                    var name = resourceItem.resource + '::' + action;
                    var item = self.getByResource(name);

                    item.methods.splice(item.methods.indexOf(resourceSub.method), 1);

                    if (resourceSub.method == 'PUT') {
                        item.methods.splice(item.methods.indexOf('PATCH'), 1);
                    } else if (resourceSub.method == 'PATCH') {
                        item.methods.splice(item.methods.indexOf('PUT'), 1);
                    }

                    if (item.methods.length == 0) {
                        self.dataSource.remove(item);
                    } else {
                        item.set('methods', item.methods);
                    }

                    console.log(item.methods);
                });
            }
            console.log(this);
        };

        Assigner.prototype.getByResource = function (resource) {
            return this.dataSource.data().find(function (m) {return m.resource == resource;});
        };

        var httpOptions = {
            'POST'   : '增',
            'DELETE' : '删',
            'PUT'    : '改',
            'PATCH'  : '改',
            'GET'    : '查'
        };

        Assigner.prototype.fetchItems = function (callback) {
            var self = this;

            self.dataSource.promise().then(function () {
                var assignedData = {};
                $.each(self.dataSource.data().toJSON(), function (i, item) {
                    $.each(item.methods, function (j, method) {
                        assignedData[item.resource + '::' + method] = true;
                    });
                });

                var isChecked = function (resourceItem, resourceMethod) {
                    var self = this;

                    for (var i = 0; i < resourceItem.actions.length; i++) {
                        if (assignedData[resourceItem.resource+'::'+resourceItem.actions[i]+'::'+resourceMethod]) {
                            return true;
                        }
                    }
                    return false;
                };

                resources.promise().then(function () {
                    var data = resources.data().toJSON();
                    var assignedData = {};

                    $.map(data, function(x) {

                        var items = {};
                        x.items = [];
                        $.each(x.methods, function (i, method) {
                            var item = {
                                description: httpOptions[method],
                                method: method,
                                checked: isChecked(x, method)
                            };

                            if (!items[httpOptions[method]]) {
                                items[httpOptions[method]] = item;
                                x.items.push(item);

                                x.checked = x.checked || item.checked;
                            }
                        });

                        return x;
                    });

                    console.log(data);
                    callback(data);
                });
            });
        };

        return Assigner;
    });