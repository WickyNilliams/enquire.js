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
        },

        exec: {
            'meteor-init': {
                command: [
                    // Make sure Meteor is installed, per https://meteor.com/install.
                    // The curl'ed script is safe; takes 2 minutes to read source & check.
                    'type meteor >/dev/null 2>&1 || { curl https://install.meteor.com/ | sh; }',
                    // Meteor expects package.js to be in the root directory
                    'cp meteor/package.js .'
                ].join(';')
            },
            'meteor-cleanup': {
                // remove build files and restore Dojo's package.js
                command: 'rm -rf ".build.*" versions.json; rm -rf package.js'
            },
            'meteor-test': {
                command: 'spacejam --mongo-url mongodb:// test-packages ./'
            },
            'meteor-publish': {
                command: 'meteor publish'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rigger');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('test', ['jshint:prebuild', 'jasmine']);
    grunt.registerTask('test:meteor', ['exec:meteor-init', 'exec:meteor-test', 'exec:meteor-cleanup']);
    grunt.registerTask('default', ['test', 'rig', 'jshint:postbuild', 'uglify']);
    grunt.registerTask('release:meteor', ['exec:meteor-init', 'exec:meteor-publish', 'exec:meteor-cleanup']);
};
