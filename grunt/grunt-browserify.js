module.exports = function(grunt) {

    grunt.config.set('browserify', {

        dev: {
            options: {
              browserifyOptions: {
                  standalone: 'ScrollTie'
              },
            },
            files: {
                'dist/scrollTie.js': ['src/plugin.js']
            }
        },

        prod: {
            options: {
                transform: ['uglifyify'],
                browserifyOptions: {
                    standalone: 'ScrollTie'
                }
            },
            files: {
                'dist/scrollTie.min.js': ['src/plugin.js']
            }
        },

        tests: {
            options: {
              browserifyOptions: {
                debug: true
              }
            },
            files: {
                'tests/js/testBundle.js': [
                  'tests/js/setup.js',
                  'tests/js/src/scrollTie-tests.js',
                  'tests/js/runner.js'
                ]
            }
        }

    })

    grunt.loadNpmTasks('grunt-browserify');
}
