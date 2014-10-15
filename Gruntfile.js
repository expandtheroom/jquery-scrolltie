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
                tasks: ['less:development']
            },
            concat: {
                files: jsSrcFiles,
                tasks: ['concat:development']
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

            development: {
                options: {
                    paths: lessOptionsPaths
                },
                files: lessOuputFiles
            }

        },

        cssmin: {
            minify: {
                files: {
                    'css/style.min.css': 'css/style.css'
                }
            }
        },

        uglify: {

            development: {
                files: { 
                    'js/custom.min.js': jsSrcFiles 
                }
            }

        },

        concat: {
            options: {
                separator: ';'
            },
            development: {
                src: jsVendorFiles.concat(jsSrcFiles),
                dest: 'js/scripts.js'
            },
            prod: {
                src: jsVendorFiles.push('js/custom.min.js'),
                dest: 'js/scripts.min.js'
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

    grunt.registerTask('default', ['less', 'concat:development' ]);
    grunt.registerTask('dist', ['less', 'cssmin', 'uglify', 'concat' ]);

};