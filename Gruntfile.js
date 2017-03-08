module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.homepage %>\n' +
            ' * License: MIT' +
            ' */\n\n',
            outputDir: 'dist',
            output : '<%= meta.outputDir %>/<%= pkg.name %>',
            outputMin : '<%= meta.outputDir %>/<%= pkg.name.replace("js", "min.js") %>'
        },

        uglify: {
            options : {
                banner : '<%= meta.banner %>',
                report: 'gzip'
            },
            dist: {
                files : {
                    '<%= meta.outputMin %>'  : '<%= meta.output %>'
                }
            }
        },

        jshint: {
            options: {
                jshintrc : true,
                reporter: require('jshint-stylish')
            },
            prebuild : [
                'Gruntfile.js',
                'src/*.js',
                'spec/*.js'
            ]
        },

        browserify : {
            dev: {
                files: {
                    '<%= meta.output %>' : 'src/index.js',
                },
                options : {
                    watch : true,
                    browserifyOptions : {
                        debug : true,
                        standalone : 'enquire'
                    }
                }
            },

            dist : {
                files: {
                    '<%= meta.output %>' : 'src/index.js',
                },
                options : {
                    banner : '<%= meta.banner %>',
                    plugin: [
                        require('bundle-collapser/plugin')
                    ],
                    browserifyOptions : {
                        standalone : 'enquire'
                    }
                }
            }
        },

        karma : {
            options : {
                frameworks : ['browserify', 'jasmine'],
                files : [
                    'spec/*.js'
                ],
                preprocessors : {
                    'spec/*.js': 'browserify'
                },
                browserify: {
                    extensions: ['.js'],
                    debug : true
                },
                browsers : ['PhantomJS'],
                reporters : ['dots']
            },

            continuous : {
                options : {
                    singleRun: true
                }
            },

            unit : {
                options : {
                    background: true,
                    singleRun: false
                }
            }
        },

        watch: {
            test : {
                options : {
                    atBegin : true
                },
                files: '<%= jshint.prebuild %>',
                tasks: ['jshint', 'karma:unit:run']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['karma:unit:start', 'watch']);
    grunt.registerTask('test', ['jshint', 'karma:continuous']);
    grunt.registerTask('build', ['browserify:dist', 'uglify']);
};
