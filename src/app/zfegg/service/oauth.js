define('zfegg/service/oauth', ['../model/oauth', 'zfegg/config'], function(Oauth, config) {

    return new Oauth(config.baseUrl + '/oauth', config.oauth.clientId, config.oauth.clientSecret);
});
