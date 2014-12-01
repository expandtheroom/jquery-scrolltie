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

    grunt.initConfig({

        watch: {
            options: {
                interval: 20
            },
            less: {
                files: ['less/*.less'],
                tasks: ['less']
            },
            jshint: {
                files: jsSrcFiles,
                tasks: ['jshint']
            },
            all: {
                files: ['*/**', '!node_modules/*/**', '!less/*.less'],
                options: {
                    livereload: true
                }
            },
        },

        less: {

            default: {
                options: {
                    paths: lessOptionsPaths,
                    cleancss: true
                },
                files: lessOuputFiles
            }

        },

        uglify: {

            default: {
                files: { 
                    'js/scrollTie.min.js': jsSrcFiles 
                }
            }

        },

        jshint: {
            files: jsSrcFiles
        }

    });

    /*-------------------------------------------- */
    /** Load Tasks */
    /*-------------------------------------------- */

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');

    /*-------------------------------------------- */
    /** Register Tasks */
    /*-------------------------------------------- */

    grunt.registerTask('default', ['less']);
    grunt.registerTask('dist', ['less', 'uglify' ]);

};