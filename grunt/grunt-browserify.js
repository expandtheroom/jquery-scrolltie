module.exports = function(grunt) {
    /*-------------------------------------------- */
    /** Path / File Config */
    /*-------------------------------------------- */
    
    var paths = {
        src: 'js/src/',
        vendor: 'js/vendor/',
        built: 'js/'
    };

    grunt.config.set('browserify', {

        dev: {
            files: {
                'js/scrollTie.js': [paths.src + '**/*.js']
            }
        },

        prod: {
            options: {
                transform: ['uglifyify']
            },
            files: {
                'js/scrollTie.min.js': [paths.src + '**/*.js']
            }
        }

    })

    grunt.loadNpmTasks('grunt-browserify');
}