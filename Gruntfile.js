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
            //压缩 RequireJS
            bower: {
                files: [
                    {
                        src: 'bower_components/requirejs/require.js',
                        dest: 'bower_components/requirejs/require.min.js'
                    },
                    {
                        src: 'bower_components/js-cookie/src/js.cookie.js',
                        dest: 'bower_components/js-cookie/src/js.cookie.min.js'
                    }
                ]
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
                        dest: '<%=zfegg.dist%>/zfegg-admin-ui/styles/'
                    }
                ]
            },
            kendo: {
                src: 'libs\\kendo\\js\\kendo.web.min.js',
                dest: '.tmp\\libs\\kendo\\js\\kendo.web.min.js'
            }
        },
        useminPrepare: {
            html: '<%=zfegg.dist%>/*.html',
            options: {
                dest: '<%=zfegg.dist%>',
                root: '<%=zfegg.src%>',
                flow: {
                    html: {
                        steps: {
                            js: ['uglify', 'concat'],
                            css: ['concat', 'cssmin']
                        },
                        post: {
                            js: [{
                                name: 'uglify',
                                createConfig: function (context, block) {
                                    var generated = context.options.generated;

                                    if (block.dest.indexOf('scripts/vendor.min.js') > -1) {
                                        generated.files = generated.files.filter(function (f) {
                                            return f.dest.indexOf('kendo') == -1;
                                        });
                                    } else if (block.dest.indexOf('scripts/app.min.js') > -1) {
                                        generated.files = generated.files.map(function (f) {
                                            if (f.dest.indexOf('main.js') != -1) {
                                                f.src = ['<%=zfegg.src%>/app/**/*.js'];
                                            }
                                            return f;
                                        });
                                    }
                                }
                            }]
                        }
                    }
                }
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
        debug: {
            login: {
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
        'uglify:generated',
        'copy:kendo',
        //'debug',
        'concat:generated',
        'cssmin:generated',
        //'filerev',
        'usemin',
        'clean:usemin-tmp'
    ]);


    grunt.registerMultiTask('debug', 'Debug.', function () {

        var options = this.options({
            search: null
        });

        console.log(grunt.config('uglify').generated.files);
        console.log(grunt.config('concat').generated.files);

        return ;
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