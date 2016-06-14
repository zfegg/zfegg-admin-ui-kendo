({
    appDir: './src',
    mainConfigFile: './src/scripts/vendor.js',
    baseUrl: "./scripts",
    dir: "scripts-build",
    modules: [
        {
            name: 'vendor',
            include: ['jquery',
                'base64',
                'cookie',
                'bootstrap',
                'admin-lte',
                'text',
                'requirejs'
            ]
        },
        //
        //{
        //    name: 'zfegg/app',
        //    include: [],
        //    exclude: ['./vendor',
        //        'kendo',
        //        'jquery',
        //        'base64',
        //        'cookie',
        //        'bootstrap',
        //        'admin-lte',
        //        'text']
        //}
    ],
    onModuleBundleComplete: function (data) {
        console.log(data);
    },
    fileExclusionRegExp: /(index-dev.html)/,
    removeCombined: true
});