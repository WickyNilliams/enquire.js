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

        rig: {
            options : {
                banner : '<%= meta.banner %>'
            },
            dist: {
                files: {
                    '<%= meta.output %>' : ['src/include/wrap.js']
                }
            }
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

        watch: {
            files: '<%= jshint.prebuild %>',
            tasks: 'test'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rigger');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['jshint:prebuild', 'jasmine']);
    grunt.registerTask('default', ['test', 'rig', 'jshint:postbuild', 'uglify']);
};
