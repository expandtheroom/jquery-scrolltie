module.exports = function(grunt) {
    grunt.config.set('watch', {
        options: {
            interval: 20
        },
        less: {
            files: ['less/*.less'],
            tasks: ['less']
        },
        jshint: {
            files: ['js/src/*.js'],
            tasks: ['jshint']
        },
        all: {
            files: ['*/**', '!node_modules/*/**', '!less/*.less'],
            options: {
                livereload: true
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
};
