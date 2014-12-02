module.exports = function(grunt) {
    grunt.config.set('jshint', {
        files: ['js/src/*.js']
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
};
