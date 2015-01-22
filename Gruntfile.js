module.exports = function(grunt) {

    /*-------------------------------------------- */
    /** Initialize and load tasks from grunt folder */
    /*-------------------------------------------- */
    
    grunt.initConfig();
    grunt.loadTasks('grunt');

    /*-------------------------------------------- */
    /** Register Tasks */
    /*-------------------------------------------- */

    grunt.registerTask('default', ['less', 'browserify', 'umd' ]);

};