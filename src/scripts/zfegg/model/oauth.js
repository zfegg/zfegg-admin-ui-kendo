define(['jquery', 'kendo', 'cookie', 'base64'], function($, kendo, Cookies) {

    var loginLocked = false;

    var OAuth = kendo.Observable.extend({
        init: function (path, clientId, clientSecret, prefix) {

            kendo.Observable.fn.init.call(this);
            this.COOKIE_PREFIX = prefix || 'zfegg_oauth';
            this.KEY_PASSWORD = this.COOKIE_PREFIX + '_password';

            this.path = path;
            this.clientId = clientId;
            this.clientSecret = clientSecret;

            this.isLogin() && this._setLoginSuccess();
        },
        isLogin: function () {
            return Boolean(Cookies.getJSON(this.KEY_PASSWORD));
        },
        _setLoginSuccess : function (result) {
            if (result) {
                var params = {};
                if (result.expires_in) {
                    var now = new Date();
                    now.setTime(now.getTime() + result.expires_in * 1000);
                    params.expires = now;
                }
                Cookies.set(this.KEY_PASSWORD, result, params);
            }

            $.ajaxSetup({
                headers: {
                    Authorization: this.getBearer()
                }
            });
        },
        login : function (params, ajaxParams) {
            var self = this;

            if (loginLocked) {
                return this;
            }

            $.ajax($.extend(ajaxParams, {
                type: 'POST',
                url: self.path,
                dataType: "json",
                headers: {
                    Authorization: this.getBasic()
                },
                data: $.extend(params, {grant_type: 'password'}),
                success: function (result) {
                    self._setLoginSuccess(result);
                    self.trigger('login.success', result);
                },
                error: function (xhr) {
                    self.trigger('login.error', xhr);
                },
                complete: function (xhr) {
                    loginLocked = false;
                    self.trigger('login.complete', xhr);
                }
            }));
            loginLocked = true;

            return this;
        },
        getBearer: function () {
            if (!this.isLogin()) {
                throw new Error('Please login.');
            }
            return 'Bearer ' + Cookies.getJSON(this.KEY_PASSWORD).access_token;
        },
        getBasic: function () {
            return 'Basic ' + Base64.encode(this.clientId + ':' + this.clientSecret);
        },
        logout : function () {
            Cookies.set(this.KEY_PASSWORD, null, {expires: 0});
            delete $.ajaxSettings.headers.Authorization;
        }
    });

    return OAuth;
});