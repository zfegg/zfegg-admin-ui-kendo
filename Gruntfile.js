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
            "usemin-tmp": ['.tmp', '<%=zfegg.src%>/app/templates.js']
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
                src: '<%=zfegg.src%>/app/**/*.js',
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
                files: [
                    {
                        expand: true,
                        cwd: '<%=zfegg.src%>',
                        src: '*.html',
                        dest: '<%=zfegg.dist%>/'
                    },
                    {
                        expand: true,
                        cwd: 'libs/kendo/styles/',
                        src: 'Bootstrap/*',
                        dest: '<%=zfegg.dist%>/styles/'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/bootstrap/dist/',
                        src: ['{css,js}/*.min.*', 'fonts/*'],
                        dest: '<%=zfegg.dist%>/bootstrap/'
                    },
                    {
                        src: 'bower_components/jquery/dist/jquery.min.js',
                        dest: '<%=zfegg.dist%>/scripts/jquery.min.js'
                    }
                ]
            },
            "usemin-tmp": {
                src: '.tmp/concat/scripts/vendor.min.js',
                dest: '<%=zfegg.dist%>/scripts/vendor.min.js'
            },
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
        html2js: {
            options: {
                //替换模板 "src/app" 为空;
                fileFooterString: '(function (t) { var p = "<%=zfegg.src%>/"; for(var i in t) { t[i.replace(p, "")] = t[i]; delete t[i]; }})(this.templates);'
            },
            main: {
                src: ['<%=zfegg.src%>/app/**/*.html'],
                dest: '<%=zfegg.src%>/app/templates.js'
            }
        },
        replace: {
            //    <link href="../bower_components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
            //<script src="../bower_components/jquery/dist/jquery.min.js"></script>
            //
            login: {
                options: {
                    search: ['../bower_components/bootstrap/dist', '../bower_components/jquery/dist'],
                    to: ['bootstrap', 'scripts']
                },
                files: {
                    src: '<%=zfegg.dist%>/login.html'
                }
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', [
        'clean:dist',
        'copy:dist',
        'html2js',
        'useminPrepare',
        'concat',
        'copy:usemin-tmp',
        //'uglify:generated',
        'cssmin:generated',
        //'filerev',
        'usemin',
        'uglify:dist', //压缩app下所有js 覆盖文件usemin 生成的
        'replace:login',
        'clean:usemin-tmp'
    ]);


    grunt.registerMultiTask('replace', 'Replace paths.', function () {

        var options = this.options({
            search: null
        });

        this.files.forEach(function (f) {
            f.src.forEach(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return;
                }

                if (!options.search instanceof Array) {
                    options.search = [options.search];
                }

                var content = grunt.file.read(filepath);
                options.search.forEach(function (search, i) {
                    content = content.replace(search, options.to[i]);
                });
                grunt.file.write(filepath, content);

                grunt.log.writeln('"' + filepath + '" replaced.');
            });
        });
    });

};