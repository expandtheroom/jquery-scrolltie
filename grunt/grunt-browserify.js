module.exports = function(grunt) {

    grunt.config.set('browserify', {

        dev: {
            files: {
                'dist/scrollTie.js': ['src/plugin.js']
            }
        },

        prod: {
            options: {
                transform: ['uglifyify'],
                standalone: 'ScrollTie'
            },
            files: {
                'dist/scrollTie.min.js': ['src/plugin.js']
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