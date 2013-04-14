/*global module:false*/
module.exports = function(grunt) {

    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '// <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
            '// Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.homepage %>\n' +
            '// License: <%= _.map(pkg.licenses, function(x) {return x.type + " (" + x.url + ")";}).join(", ") %>\n\n'
        },

        jasmine : {
            options : {
                specs : 'spec/*.js'
            },
            src : 'src/*.js'
        },

        concat: {
            options : {
                banner : '<%= meta.banner %>'
            },
            dist: {
                src: [
                    'src/include/intro.js',
                    'src/Util.js',
                    'src/QueryHandler.js',
                    'src/MediaQuery.js',
                    'src/MediaQueryDispatch.js',
                    'src/include/outro.js'
                ],
                dest: 'dist/<%= pkg.name %>'
            }
        },

        uglify: {
            options : {
                banner : '<%= meta.banner %>',
                report: 'gzip'
            },
            dist: {
                files : {
                    'dist/<%= pkg.name.replace("js", "min.js") %>'  : '<%= concat.dist.dest %>'
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
            postbuild : [
                '<%= concat.dist.dest %>'
            ]
        },

        watch: {
            files: '<%= jshint.prebuild %>',
            tasks: 'test'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('test', ['jshint:prebuild', 'jasmine']);
    grunt.registerTask('default', ['test', 'concat', 'jshint:postbuild', 'uglify']);
};
