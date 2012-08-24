/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-less');
  grunt.loadNpmTasks('grunt-css');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '// <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
              '// Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.homepage %>\n' +
              '// License: <%= _.map(pkg.licenses, function(x) {return x.type + " (" + x.url + ")";}).join(", ") %>\n'
    
    },

    less : {
      all : {
        src : 'css/pages.less',
        dest : 'css/pages.css'
      }
    },

    concat: {
      all: {
        src: [
          'css/main.css',
          'css/pages.css'
        ],
        dest: 'css/<%= pkg.name %>.css'
      }
    },

    cssmin: {
      all: {
        src: ['<banner:meta.banner>', '<config:concat.all.dest>'],
        dest: 'css/<%= pkg.name %>.min.css'
      }
    }

  });

    // Default task.
  grunt.registerTask('default', 'less concat cssmin');
};
