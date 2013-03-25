/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less : {
      all : {
        options :{
          yuicompress : true
        },
        files : {
           'css/<%= pkg.name %>.css' : 'less/<%= pkg.name %>.less'
        }
      }
    },

    watch : {
      files : 'less/**/*.less',
      tasks : 'default'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', 'less');
};
