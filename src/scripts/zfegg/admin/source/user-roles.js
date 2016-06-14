define('zfegg/admin/source/user-roles',
    [
        'jquery',
        'kendo',
        'zfegg/config',
        'zfegg/kendo/restful-data-source',
        './roles'
    ],
    function($, kendo, config, Restful, roles) {
        'use strict';

        var Assigner = function (user) {
            var self = this;
            var url = config.baseUrl + '/users/' + user.user_id + '/roles';
            var assignerSource = new Restful({
                url:  url,
                transport: {
                    destroy: {
                        url: function (e) {
                            return url + "/" + e.role_id;
                        }
                    }
                },
                schema: {
                    parse: function (response) {
                        if (response._embedded && response._embedded.user_roles) {
                            var data = response._embedded.user_roles;

                            $.map(data, function (o) {
                                o.non_id = kendo.guid();
                                return o;
                            });

                            data.non_id = kendo.guid();
                            return data;
                        }

                        return response;
                    },
                    model: {
                        id: "non_id",
                        fields: {
                            non_id: {},
                            role_id: {},
                            name: {},
                            parent_id: {}
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

                            roles.dataSource.promise().then(function () {
                                flatData = roles.dataSource.data().toJSON();

                                $.map(flatData, function(x) {
                                    if (self.getByRoleId(x.role_id)) {
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

        Assigner.prototype.assign = function (roleItem) {
            if (roleItem.checked) {
                this.dataSource.add({role_id:roleItem.role_id});
            } else {
                var item = this.getByRoleId(roleItem.role_id);
                this.dataSource.remove(item);
            }
            this.dataSource.sync();
        };

        Assigner.prototype.getByRoleId = function (role_id) {
            return this.dataSource.data().find(function (m) {return m.role_id == role_id;});
        };

        return Assigner;
    });