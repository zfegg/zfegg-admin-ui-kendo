var gulp = require("gulp");
var clean = require("gulp-clean");
var extend = require("extend");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var cleanCss = require("gulp-clean-css");
var runSequence = require('run-sequence');
var requirejsOptimize = require("gulp-requirejs-optimize");
var sourcemaps = require('gulp-sourcemaps');

var paths = {
    distAssets: 'dist/assets/zfegg-admin-ui',
    dist: 'dist',
    view: 'view'
};

var amdConfig = {
    baseUrl: './src/scripts',
    paths: {
        requirejs: '../../node_modules/requirejs/require',
        jquery: '../../node_modules/jquery/dist/jquery.min',
        kendo: '../../libs/kendo/js/kendo.web.min',
        base64: '../../node_modules/js-base64/base64',
        cookie: '../../node_modules/js-cookie/src/js.cookie',
        bootstrap: '../../node_modules/bootstrap/dist/js/bootstrap.min',
        'admin-lte': '../../node_modules/admin-lte/dist/js/app.min',
        text: '../../node_modules/text/text'
    },
    shim: {
        'admin-lte': {
            deps: ['jquery', 'bootstrap']
        },
        bootstrap: {
            deps: ['jquery']
        }
    }
};

gulp.task("optimize-app", function () {
    return gulp.src('src/scripts/zfegg/app.js')
        .pipe(sourcemaps.init())
        .pipe(requirejsOptimize(extend({
            useStrict: true,
            include: [
                'requirejs',
                'base64',
                'cookie',
                'bootstrap',
                'admin-lte',
                'text',
                'zfegg/app',
                'zfegg/kendo/binder-window-center',
                'zfegg/kendo/restful-data-source',
            ],
            //insertRequire: ['zfegg/app'],
            exclude: [
                'kendo',
                'jquery',
            ],
            wrap: {
                end: 'define("jquery", function () {return window.jQuery;});' +
                'define("kendo", function () {return window.kendo;});' +
                //'define("base64", function () {return window.Base64;});' +
                //'define("cookie", function () {return window.Cookies;});' +
                '',
                start: ''
            },
        }, amdConfig)))
        .pipe(rename('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.distAssets));
});

gulp.task("optimize-vendor", function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'libs/kendo/js/kendo.web.min.js',
    ])
        .pipe(gulp.dest(paths.distAssets));
    //
    //return gulp.src('src/scripts/config.js')
    //    .pipe(requirejsOptimize(extend({
    //
    //    }, amdConfig)))
    //    .pipe(rename('vendor.min.js'))
    //    .pipe(gulp.dest(paths.distAssets));
});

gulp.task("clean", function () {
    return gulp.src(paths.dist + '/*')
        .pipe(clean());
});

gulp.task("resources", function () {
    gulp.src([
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        "node_modules/font-awesome/css/font-awesome.min.css",
        "node_modules/ionicons/dist/css/ionicons.min.css",
        "node_modules/admin-lte/dist/css/AdminLTE.min.css",
        "node_modules/admin-lte/dist/css/skins/skin-blue.min.css",
        "src/styles/zfegg-admin-ui.css"
    ])
        .pipe(cleanCss())
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(paths.distAssets + '/css'));

    gulp.src(
        [
            'node_modules/bootstrap/dist/fonts/*',
            'node_modules/ionicons/dist/fonts/*',
            'node_modules/font-awesome/fonts/*',
        ]
    )
        .pipe(gulp.dest(paths.distAssets + '/fonts'));

    gulp.src(
        [
            "libs/kendo/styles/kendo.common.min.css",
            "libs/kendo/styles/kendo.bootstrap.min.css"
        ]
    )
        .pipe(gulp.dest(paths.distAssets + '/css'));

    gulp.src("libs/kendo/styles/Bootstrap/**/*")
        .pipe(gulp.dest(paths.distAssets + '/css/Bootstrap'));

    //gulp.src([
    //    'node_modules/ionicons/dist/svg/*',
    //]).pipe(gulp.dest(paths.distAssets + '/svg'));
    gulp.src([
        'node_modules/admin-lte/dist/img/{avatar,boxed-bg,icons,default}*',
    ]).pipe(gulp.dest(paths.distAssets + '/img'));

    gulp.src([
        'src/data/*',
    ]).pipe(gulp.dest(paths.dist + '/data'));

    gulp.src('src/index-prod.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest(paths.dist));
    return;
});

gulp.task("phtml", function () {
    return gulp.src('dist/index.html')
        .pipe(replace('/*SET_OPTIONS*/', "<?=sprintf('options=$.extend(options, %s);', json_encode($configs))?>"))
        .pipe(replace('/*SET_MODULES*/', "<?='modules='.json_encode(isset($modules) ? $modules : [])?>"))
        .pipe(rename('zfegg-admin-ui.phtml'))
        .pipe(gulp.dest(paths.view));
});

gulp.task("default", function () {
    runSequence("clean", "optimize-app", "optimize-vendor", "resources", "phtml");
});