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
           'css/enquire.css' : 'less/enquire.less'
        }
      }
    },

    concat: {
      examples: {
          src: [
              'js/example.js',
              'js/code-view.js'
          ],
          dest: 'js/examples.js'
      }
    },

    uglify: {
      options : {
        // TODO: find out why this was causing build to fail
        // report: 'gzip'
      },
      base : {
        files : {
          'js/base.js' : [
            'js/vendor/matchMedia.js',
            'js/vendor/matchMedia.addListener.js',
            'js/vendor/prism.js',
            'js/enquire.min.js'
          ]
        }
      },
      examples: {
        files : {
            'js/examples.min.js' : '<%= concat.examples.dest %>'
        }
      },
      toc : {
        files : {
          'js/toc.min.js' : 'js/toc.js'
        }
      },
      zepto: {
        files : {
            'js/vendor/zepto.min.js' : 'js/vendor/zepto.js'
        }
      },
      bootstrap: {
        files : {
            'js/vendor/bootstrap.min.js' : 'js/vendor/bootstrap.js'
        }
      }
    },

    watch : {
      files : 'less/**/*.less',
      tasks : 'default'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['less', 'concat', 'uglify']);
};
