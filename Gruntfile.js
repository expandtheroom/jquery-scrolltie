module.exports = function(grunt) {

    /*-------------------------------------------- */
    /** Project Config */
    /*-------------------------------------------- */

    var lessOptionsPaths = ['less'],
        lessOuputFiles = {
            'css/style.css': 'less/style.less'
        };

    var jsVendorFiles = ['js/vendor/*.js'],
        jsSrcFiles = ['js/src/*.js'];

    /*-------------------------------------------- */
    /** Initialize and load tasks from grunt folder */
    /*-------------------------------------------- */
    
    grunt.initConfig();
    grunt.loadTasks('grunt');

    /*-------------------------------------------- */
    /** Register Tasks */
    /*-------------------------------------------- */

    grunt.registerTask('default', ['less']);
    grunt.registerTask('dist', ['less', 'uglify' ]);

};