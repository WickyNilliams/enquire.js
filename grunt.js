/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-jasmine-task');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '// <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
              '// Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.homepage %>\n' +
              '// License: <%= _.map(pkg.licenses, function(x) {return x.type + " (" + x.url + ")";}).join(", ") %>\n'
    
    },

    jasmine : {
      src : ['spec/SpecRunner.html']
    },

    concat: {
      build: {
        src: [
          '<banner:meta.banner>',
          'src/include/intro.js',

          'src/Util.js',
          'src/QueryHandler.js',
          'src/MediaQuery.js',
          'src/MediaQueryDispatch.js',

          'src/include/outro.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },


    lint: {
      prebuild : [
        'grunt.js',
        'src/*.js',
        'demo/js/*.js'
      ],
      postbuild : [
        '<config:concat.build.dest>'
      ]
    },

    min: {
      standard: {
        src: ['<banner:meta.banner>', '<config:concat.build.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    watch: {
      files: '<config:lint.files>',
      tasks: 'lint jasmine'
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        matchMedia: true,
        each: true,
        isArray: true,
        QueryHandler: true,
        MediaQuery: true,
        MediaQueryDispatch: true
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint:prebuild jasmine concat min lint:postbuild');


};
