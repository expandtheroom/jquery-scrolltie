module.exports = function(grunt) {

    grunt.config.set('browserify', {

        dev: {
            files: {
                'js/dist/scrollTie.js': ['js/src/plugin.js']
            }
        },

        prod: {
            options: {
                transform: ['uglifyify'],
                standalone: 'ScrollTie'
            },
            files: {
                'js/dist/scrollTie.min.js': ['js/src/plugin.js']
            }
        },

        tests: {
            files: {
                'tests/js/testBundle.js': ['tests/js/src/scrollTie-tests.js']
            }
        }

    })

    grunt.loadNpmTasks('grunt-browserify');
}