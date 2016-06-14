define(['../model/oauth', 'zfegg/config'], function(OAuth, config) {

    return new OAuth(config.baseUrl + '/oauth', config.oauth.clientId, config.oauth.clientSecret);
});
