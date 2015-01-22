module.exports = function(grunt) {

    var deps = {
        'default': ['jquery'],
        amd: ['jquery'],
        cjs: ['jquery'],
        global: ['jQuery']
    };

    grunt.config.set('umd', {

        dev: {
            src: 'dist/scrollTie.js',
            deps: deps,
            template: './templates/umd.hbs',
            browserifyMapping: '{"jquery": $}'
        },

        dist: {
            src: 'dist/scrollTie.min.js',
            deps: deps,
            template: './templates/umd.hbs',
            browserifyMapping: '{"jquery": $}'
        }

    })

    grunt.loadNpmTasks('grunt-umd');
}
