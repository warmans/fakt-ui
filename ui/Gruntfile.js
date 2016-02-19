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
                      //jquery
                      'bower_components/jquery/dist/jquery.js',
                      //bootstrap
                      'bower_components/bootstrap/dist/js/bootstrap.min.js',
                      //moment
                      'bower_components/moment/moment.js',
                      //require
                      'bower_components/requirejs/require.js'
                  ],
                  'static/dist/vendor.css': []
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
        watch: {
            files: ['static/src/less/style.less'],
            tasks: ['less']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat', 'uglify', 'less']);
}
