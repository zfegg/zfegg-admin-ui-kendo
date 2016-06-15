({
    appDir: './src',
    mainConfigFile: './src/scripts/config.js',
    baseUrl: "./scripts",
    dir: "scripts-build",
    modules: [
        {
            name: 'config',
            include: [
                'base64',
                'cookie',
            ]
        },
        //
        //{
        //    name: 'zfegg/app',
        //    include: [],
        //    exclude: ['./config',
        //        'kendo',
        //        'jquery',
        //        'base64',
        //        'cookie',
        //        'bootstrap',
        //        'admin-lte',
        //        'text'
        //    ]
        //}
    ],
    onModuleBundleComplete: function (data) {
        console.log(data);
    },
    fileExclusionRegExp: /(index-dev.html)/,
    removeCombined: true
});