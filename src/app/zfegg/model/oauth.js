define('zfegg/model/oauth', ['jquery', 'cookie', 'base64'], function($, Cookies, Base64) {

    var Events = function (obj) {
        this.obj = obj;
        this.events = {};
    };
    Events.prototype.bind = function (name, callback){
        if (!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name].push(callback);
    };
    Events.prototype.trigger = function (name){
        var self = this;
        if (!this.events[name]) {
            return ;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        $.each(this.events[name], function (i, callback) {
            callback.apply(self.obj, args);
        });
    };

    var Auth = function (path, clientId, clientSecret, key) {

        this.KEY = key || 'zfegg_oauth';
        this.KEY_PASSWORD = this.KEY + '_password';

        this.path = path;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.event = new Events(this);

        this.isLogin() && this._setLoginSuccess();
    };

    Auth.prototype.isLogin = function () {
        return Boolean(Cookies.getJSON(this.KEY_PASSWORD));
    };

    Auth.prototype._setLoginSuccess = function (result) {
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
    };

    var loginLocked = false;

    Auth.prototype.login = function (params, ajaxParams) {
        var self = this;

        if (loginLocked) {
            return this.event;
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
                self.event.trigger('login.success', result);
            },
            error: function (xhr) {
                self.event.trigger('login.error', xhr);
            },
            complete: function (xhr) {
                loginLocked = false;
                self.event.trigger('login.complete', xhr);
            }
        }));
        loginLocked = true;

        return this.event;
    };

    Auth.prototype.getBearer = function () {
        if (!this.isLogin()) {
            throw new Error('Please login.');
        }
        return 'Bearer ' + Cookies.getJSON(this.KEY_PASSWORD).access_token;
    };

    Auth.prototype.getBasic = function () {
        return 'Basic ' + Base64.encode(this.clientId + ':' + this.clientSecret);
    };

    Auth.prototype.bind = function () {
        var args = Array.prototype.slice.call(arguments);
        this.event.bind.apply(this.event, args);
        return this;
    };

    Auth.prototype.trigger = function () {
        var args = Array.prototype.slice.call(arguments);
        this.event.trigger.apply(this.event, args);
        return this;
    };

    Auth.prototype.logout = function () {
        Cookies.set(this.KEY_PASSWORD, null, {expires: 0});
        delete $.ajaxSettings.headers.Authorization;
    };

    return Auth;
});