define('zfegg/config', function() {

    return {
        baseUrl: document.getElementsByTagName('base')[0].href.replace(/\/+$/, '')
    };
});