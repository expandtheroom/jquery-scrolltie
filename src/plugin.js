/**
 * ScrollTie: Ties a CSS property to user scroll (common use is Parallax animation)
 */

'use strict';

/*-------------------------------------------- */
/** Requires */
/*-------------------------------------------- */

var $ = require('jquery'),
    ScrollTie = require('./scrollTie');

/*-------------------------------------------- */
/** Variables */
/*-------------------------------------------- */

var allScrollTiedElements = [],
    scrollTiedElementCounter = 0,
    publicGlobalMethods,
    publicInstanceMethods;

/*-------------------------------------------- */
/** Methods to Expose on jQuery */
/*-------------------------------------------- */

publicGlobalMethods = {
    destroy: function() {
        $.each(allScrollTiedElements, function(i, scrollTie) {
            scrollTie.destroy(allScrollTiedElements);
        });
    },

    pause: function() {
        $.each(allScrollTiedElements, function(i, scrollTie) {
            scrollTie.pause();
        });
    },

    restart: function() {
        $.each(allScrollTiedElements, function(i, scrollTie) {
            scrollTie.start();
        });
    },

    refresh: function() {
        $.each(allScrollTiedElements, function(i, scrollTie) {
            scrollTie.refresh();
        });
    },

    init: function() {
        $.each(allScrollTiedElements, function(i, scrollTie) {
            if (!scrollTie.isInitialized) {
                scrollTie.init();
            }
        });
    }
};

/*-------------------------------------------- */
/** Methods to Expose on jQuery object of Element */
/*-------------------------------------------- */

publicInstanceMethods = {
    destroy: function() {
        this.destroy(allScrollTiedElements);
        return this.$el;
    },

    pause: function() {
        this.pause();
        return this.$el;
    },

    restart: function() {
        this.start();
        return this.$el;
    },

    refresh: function() {
        this.refresh();
        return this.$el;
    },

    init: function() {
        if (!this.isInitialized) this.init();
        return this.$el;
    }
};


/*-------------------------------------------- */
/** Export */
/*-------------------------------------------- */

$.fn.scrollTie = function ( options ) {

    if (typeof options === 'string' || !options) {
        var method = options;

        if (!$(this).data().plugin_scrollTie) {
            return $.error('ScrollTie not instantiated on this element');
        } else if (publicInstanceMethods[method]) {
            return publicInstanceMethods[method].apply($(this).data().plugin_scrollTie);
        } else if (!method) {
            return $.error('ScrollTie needs a string reference to a public method or option configuration object.');
        } else {
            return $.error('ScrollTie doesn\'t recognize the method ' + method);
        }
    }

    return this.each(function () {
        options.id = 'scrollTied' + scrollTiedElementCounter++;

        if (!$.data(this, 'plugin_scrollTie')) {
            var newScrollTie = new ScrollTie( this, options );

            allScrollTiedElements.push(newScrollTie);

            $.data(this, 'plugin_scrollTie', newScrollTie);
        }
    });
};

$.scrollTie = function() {
    var method = arguments[0],
        args = arguments.length >= 2 ? [].slice.call(arguments, 1) : [];

    if (publicGlobalMethods[method]) {
        return publicGlobalMethods[method].apply(null, args);
    }

    return allScrollTiedElements;
};