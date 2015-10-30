define('zfegg/admin/controller/profile',
    [
        'require',
        'kendo',
        'zfegg/model/view',
        'zfegg/config',
        'zfegg/ui/notification'
    ],
    function (req, kendo, View, config, notification) {
        'use strict';

        var url = config.baseUrl + '/profile/index';

        var events = {
            onSubmit: function (e) {
                e.preventDefault();

                $.post(url, $(e.target).serialize(), function () {
                    notification.success('修改成功');
                });
            },
            onConfirmPassword: function (e) {
                var password = $(e.target).closest('form').find('[name=password]').get(0), confirm_password = e.target;
                if (password.value != confirm_password.value) {
                    confirm_password.setCustomValidity('输入的密码不一致');
                } else {
                    confirm_password.setCustomValidity('');
                }
            }
        };
        return new View(
            '个人信息',
            req.toUrl('./profile.html'),
            {
                model: {
                    onSubmit: function (e) {
                        e.preventDefault();
                    }
                },
                init: function (e) {
                    var self = this;
                    $.get(url, function (result) {
                        kendo.bind(self.element, $.extend(result, events));
                    });
                }
            }
        );
    });