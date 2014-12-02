module.exports = function(grunt) {
    grunt.config.set('uglify', {
        dist: {
            files: { 
                'js/scrollTie.min.js': ['js/src/scrollTie.js'] 
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
};
