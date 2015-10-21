module.exports = function (grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);


    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        zfegg: {
            dist: 'dist',
            src: 'src'
        },

        clean: {
            dist: ['<%=zfegg.dist%>/*'],
            "usemin-tmp": ['.tmp']
        },

        jshint: {
            all: [
                'Gruntfile.js',
                '<%=zfegg.src%>/**/*.js'
            ]
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' +
                "'use strict';\n"
            },
            dist: {
                src: 'src/app/**/*.js',
                dest: '<%=zfegg.dist%>/scripts/app.min.js'
            },

            //压缩 RequireJS
            requirejs: {
                src: 'bower_components/requirejs/require.js',
                dest: 'bower_components/requirejs/require.min.js'
            }
        },
        copy: {
            dist: {
                expand: true,
                cwd: '<%=zfegg.src%>',
                src: '*.html',
                dest: '<%=zfegg.dist%>/'
            },
            "usemin-tmp": {
                src: '.tmp/concat/scripts/vendor.min.js',
                dest: '<%=zfegg.dist%>/scripts/vendor.min.js'
            }
        },
        useminPrepare: {
            html: '<%=zfegg.dist%>/*.html',
            options: {
                dest: '<%=zfegg.dist%>',
                root: '<%=zfegg.src%>'
            }
        },
        usemin: {
            html: ['<%=zfegg.dist%>/*.html'],
            options: {
                assetsDirs: ['<%=zfegg.dist%>']
            }
        },

        //filerev: {
        //    dist: {
        //        src: ['<%= zfegg.dist %>/**/*.js', '<%= zfegg.dist %>/**/*.css']
        //    }
        //},

        //css: ['libs/kendo/styles/{,**/}*.css', '<%= zfegg.dist%>/**/*.css'],
        //concat: {
        //    sample: {
        //        options: {
        //            banner: '/* xxxx */\n'   // '/* abcde */\n'
        //        },
        //        src: ['src/app/**/*.js'],  // [['foo/*.js', 'bar/*.js'], 'baz/*.js']
        //        dest: '<%=zfegg.dist%>/xxx.js'      // 'build/abcde.js'
        //    }
        //}
    });

    // Default task(s).
    grunt.registerTask('default', [
        'clean:dist',
        'copy:dist',
        'useminPrepare',
        'concat',
        'copy:usemin-tmp',
        //'uglify:generated',
        'cssmin:generated',
        //'filerev',
        'usemin',
        'uglify:dist', //压缩app下所有js 覆盖文件usemin 生成的
        'clean:usemin-tmp'
    ]);
};