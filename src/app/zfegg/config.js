define('zfegg/config', function() {

    return {
        baseUrl: './data',
        oauth: {
            clientId: null,
            clientSecret: null
        },
        title: 'Zfegg Admin',
        plugins: [

        ],
        menus: [
            {
                url: "/test",
                text: "Test",
                items: [
                    {
                        url: "/test",
                        text: "Test"
                    }
                ]
            }
        ]
    };
});