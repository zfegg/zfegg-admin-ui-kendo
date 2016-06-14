define('zfegg/admin/controller/user',
    [
        'kendo',
        'zfegg/config',
        'zfegg/kendo/restful-data-source',
        '../source/user-roles',
        'zfegg/kendo/binder-window-center',
        'zfegg/ui/controller/layout',
        'text!./user.html'
    ],
    function(kendo, config, Restful, UserRolesAssigner, layout, tpl) {
    'use strict';

    var restUrl = config.baseUrl + '/users';
    var kGrid;

    var view = kendo.View(tpl, {
        model: {
            dataSource: new Restful({
                url: restUrl,
                schema: {
                    model: {
                        id: "user_id",
                        fields: {
                            user_id: {type: "number", editable: false, nullable: true},
                            account: {validation: {required: true}},
                            real_name: {validation: {required: true}},
                            email: {validation: {email: true, required: true}},
                            status: {defaultValue: 0},
                            password: {editable: true, validation: {min: 6, max: 20, required: true}},
                            create_time: {defaultValue: null, editable: false}
                        }
                    }
                },
                error: function (e) {
                    return Restful.gridErrorStatusListener(e, kGrid);
                }
            }),
            onChange: function (e) {
                kGrid = e.sender;
                kGrid.wrapper.find('.k-grid-assign').removeAttr('disabled');
            },
            onEdit: function (e) {
                if (!e.model.isNew()) {
                    var numeric = e.container.find("input[name=account]").attr("disabled", true);
                }
            },
            onDataBound: function (e) {
                kGrid = e.sender;
                kGrid.wrapper.on('click', '.k-grid-assign', function (e) {
                    if ($(this).is('[disabled]')) {
                        return ;
                    }
                    if (!kGrid.select().length) {
                        return ;
                    }
                    var user = kGrid.dataItem(kGrid.select());
                    var rolesAssigner = new UserRolesAssigner(user);
                    var view = new View(
                        '', req.toUrl('./assign-role.html'),
                        {
                            model: {
                                roles: rolesAssigner.hierarchicalDataSource,
                                isVisible: true,
                                onCheckRole: function (e) {
                                    var role = e.sender.dataItem(e.node);

                                    rolesAssigner.assign(role);
                                },
                                onWindowClose: function (e) {
                                    e.sender.destroy();
                                }
                            }
                        }
                    );

                    view.render();
                });
            }
        }
    });

    layout.view.renderContent({
        title: '用户管理',
        content: view.render()
    });
});