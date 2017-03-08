/*global module:false*/
module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.homepage %>\n' +
            ' * License: <%= _.map(pkg.licenses, function(x) {return x.type + " (" + x.url + ")";}).join(", ") %>\n' +
            ' */\n\n',
            outputDir: 'dist',
            output : '<%= meta.outputDir %>/<%= pkg.name %>',
            outputMin : '<%= meta.outputDir %>/<%= pkg.name.replace("js", "min.js") %>'
        },

        jasmine : {
            options : {
                specs : 'spec/*.js'
            },
            src : 'src/*.js'
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
                jshintrc : '.jshintrc'
            },
            prebuild : [
                'Gruntfile.js',
                'src/*.js',
                'spec/*.js',
                'demo/js/*.js'
            ],
            postbuild : {
                options : {
                    boss : true,
                    globals : {
                        'module' : false,
                        'define' : false,
                        'require' : false
                    }
                },
                files : {
                    src : ['<%= meta.output %>']
                }
            }
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
                    plugin: [
                        require('bundle-collapser/plugin')
                    ],
                    browserifyOptions : {
                        standalone : 'enquire'
                    }
                }
            }
        },

        watch: {
            test : {
                files: '<%= jshint.prebuild %>',
                tasks: 'test'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['jshint:prebuild', 'jasmine']);
    grunt.registerTask('default', ['test', 'browserify:dev', 'watch']);
    grunt.registerTask('build', ['test', 'browserify:dist']);
};
