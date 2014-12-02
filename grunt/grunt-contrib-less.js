module.exports = function(grunt) {
    grunt.config.set('less', {
        dist: {
            options: {
                paths: ['less'],
                cleancss: true
            },
            files: {
                'css/style.css': 'less/style.less'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-less');
};
