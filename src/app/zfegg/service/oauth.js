define('zfegg/service/oauth', ['../model/oauth', 'zfegg/config'], function(Oauth, config) {

    return new Oauth(config.baseUrl + '/oauth', '1000', 'testpass');
});
