define(['../model/oauth', 'zfegg/config'], function(OAuth, config) {

    return new OAuth(config.baseUrl + '/oauth.json', config.oauth.clientId, config.oauth.clientSecret);
});
