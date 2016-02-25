module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
          options: {
            separator: '\n\n'
          },
          dist: {
              files: {
                  'static/dist/vendor.js': [
                      //angular
                      'bower_components/angular/angular.js',
                      'bower_components/angular-route/angular-route.js',
                      'bower_components/angular-busy/angular-busy.js',
                      //moment
                      'bower_components/moment/moment.js',
                      //require
                      'bower_components/requirejs/require.js',
                  ],
                  'static/dist/vendor.css': [
                      'bower_components/angular-busy/dist/angular-busy.min.css',
                  ]
              }
          }
        },
        uglify: {
            dist: {
                files: {
                    'static/dist/vendor.min.js': ['static/dist/vendor.js']
                }
            }
        },
        less: {
            production: {
                options: {
                    paths: ['bower_components/bootstrap/less']
                },
                files: {
                    "static/dist/style.css": "static/src/less/style.less"
                }
            }
        },
        cssmin: {
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          target: {
            files: {
              'static/dist/all.min.css': ['static/dist/vendor.css', 'static/dist/style.css']
            }
          }
        },
        watch: {
            files: ['static/src/less/style.less'],
            tasks: ['less', 'cssmin']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['concat', 'uglify', 'less', 'cssmin']);
}
