/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta : {
      banner : ""
    },

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
        banner : '<%= meta.banner %>',
        report: 'gzip'
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
      prism: {
        files : {
            'js/vendor/prism.min.js' : 'js/vendor/prism.js'
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
