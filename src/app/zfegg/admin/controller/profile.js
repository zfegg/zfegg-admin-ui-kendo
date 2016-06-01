define('zfegg/admin/controller/profile',
    [
        'require',
        'kendo',
        'zfegg/model/view',
        'zfegg/config',
        'text!./profile.html',
        'zfegg/ui/controller/layout'
    ],
    function (req, kendo, View, config, tpl, layout) {
        'use strict';

        var url = config.baseUrl + '/profile/index';

        var events = {
            onSubmit: function (e) {
                e.preventDefault();
                var info = $(e.target).serializeArray();
                info = info.filter(function (o, i) {
                    return o.value.length > 0
                });

                $.ajax({
                    type: 'PUT',
                    url: url,
                    data: info,
                    success: function () {
                        layout.notification.success('修改成功');
                    }
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

        var view = new kendo.View(tpl,
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

        layout.view.renderContent({
            title: '个人信息',
            content: view.render()
        });
    });


/*


 $(".admin-self").kendoValidator({
 messages: {
 required: "请输入此项!",
 confirm_password: "两次输入的密码不一致"
 },
 rules: {
 confirm_password: function (input) {
 if (input.is('[name=confirm_password]')) {
 return input.val() == $(".admin-self input[name=password]").val();
 }
 return true;
 }
 }
 }).submit(function () {
 var $this = $(this), $submit = $this.find('.k-button > span');
 $submit.toggleClass('k-i-tick').toggleClass('k-loading');
 $.ajax({
 url: './admin/index/self',
 data: $(this).serialize(),
 success: function (result) {
 if (!result.code) {
 for (var i in result.errors) {
 for (var j in result.errors[i]) {
 alert(result.errors[i][j]);
 }
 }
 }
 },
 complete: function () {
 $submit.toggleClass('k-i-tick').toggleClass('k-loading');
 }
 });
 return false;
 });


 */