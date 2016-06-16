require(['config'], function () {
    require(['zfegg/app', 'kendo'], function (Application, kendo) {
        var App = new Application({
            renderElement: document.body,
            menusDataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: './data/menus.json'
                    }
                }
            })
        });
        App.run();
        window.App = App;
    });
});