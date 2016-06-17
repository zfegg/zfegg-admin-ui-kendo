require(['config'], function () {
    require([
        'zfegg/app',
        'kendo',
        'zfegg/model/oauth'
    ], function (Application, kendo, Oauth) {
        var App = new Application({
            renderElement: document.body,
            menusDataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: './data/menus.json'
                    }
                }
            }),
            oauth: new Oauth('./data/oauth.json', '123', '456')
        });
        App.run();
        window.App = App;
    });
});