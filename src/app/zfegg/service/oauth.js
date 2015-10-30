define('zfegg/service/oauth', ['../model/oauth'], function(Oauth) {

    return new Oauth('/oauth', '1000', 'testpass');
});
