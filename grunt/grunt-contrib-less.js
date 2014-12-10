module.exports = function(grunt) {
    grunt.config.set('less', {
        dist: {
            options: {
                paths: ['less'],
                cleancss: true
            },
            files: {
                'example/css/style.css': 'example/less/style.less'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-less');
};
