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
        }

    })

    grunt.loadNpmTasks('grunt-browserify');
}