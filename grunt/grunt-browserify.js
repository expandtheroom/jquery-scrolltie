module.exports = function(grunt) {

    grunt.config.set('browserify', {

        dev: {
            files: {
                'js/scrollTie.js': ['js/src/plugin.js']
            }
        },

        prod: {
            options: {
                transform: ['uglifyify']
            },
            files: {
                'js/scrollTie.min.js': ['js/src/plugin.js']
            }
        }

    })

    grunt.loadNpmTasks('grunt-browserify');
}