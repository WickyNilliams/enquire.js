/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-less');
  grunt.loadNpmTasks('grunt-css');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',

    less : {
      all : {
        src : 'less/<%= pkg.name %>.less',
        dest : 'css/<%= pkg.name %>.css'
      }
    },

    cssmin: {
      all: {
        src: '<config:less.all.dest>',
        dest: 'css/<%= pkg.name %>.min.css'
      }
    },

    watch : {
      files : 'less/**/*.less',
      tasks : 'default'
    }

  });

    // Default task.
  grunt.registerTask('default', 'less cssmin');
};
