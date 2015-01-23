module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-karma");

  return grunt.config("karma", {
    options: {
      basePath: process.cwd(),
      singleRun: true,
      captureTimeout: 7000,
      autoWatch: true,
      logLevel: "ERROR",
      reporters: ["dots", "coverage"],
      browsers: ["Firefox"],
      frameworks: ["browserify", "mocha"],
      plugins: [
        "karma-browserify",
        "karma-mocha",
        "karma-chrome-launcher",
        "karma-firefox-launcher",
        "karma-coverage"
      ],
      preprocessors: {
        "src/*.js": ["coverage", "browserify"],
        "src/**/*.js": ["coverage", "browserify"]
      },
      coverageReporter: {
        type: "lcov",
        dir: "tests/coverage"
      },
      files: [
        // Adds in a shim for PhantomJS.
        "node_modules/jquery/dist/jquery.js",
        "dist/scrollTie.min.js",
        "node_modules/chai/chai.js",
        "node_modules/sinon-chai/lib/sinon-chai.js",
        "node_modules/sinon/pkg/sinon-1.12.1.js",
        "node_modules/mocha/mocha.js",
        "tests/js/testBundle.js"
      ]
    },
    firefox: {
      options: {
        browsers: ["Firefox"],
        singleRun: true
      }
    },
    chrome: {
      options: {
        browsers: ["Chrome"],
        singleRun: true
      }
    }
  });
};
