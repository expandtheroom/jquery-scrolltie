/*-------------------------------------------- */
/** Exports */
/*-------------------------------------------- */

module.exports = ScrollTie;

/*-------------------------------------------- */
/** Requires */
/*-------------------------------------------- */

var $ = require('jquery');

var propertyUpdaterFactory = require('./propertyUpdaters/propertyUpdaterFactory'),
    elementIsInView = require('./helpers/elementIsInView');

/*-------------------------------------------- */
/** ScrollTie - logic to update property on scroll */
/*-------------------------------------------- */

// cache window
var win = window;

function ScrollTie(element, opts, undefined) {
    this.options = opts;

    this.id = opts.id;
    this.el = typeof element === 'string' ? document.querySelector(element) : element;

    // jquery elements
    this.$el = $(element);

    // options
    this.animateWhenOutOfView = opts.animateWhenOutOfView;
    this.delay = opts.delay;
    this.manualInit = opts.manualInit;

    // custom event and context defaults
    this.evt = 'scroll';
    this.context = opts.context || win;

    // callback options
    this.onDestroy = opts.onDestroy || $.noop;

    // cache jQuery objects
    this.$win = $(win);
    this.$doc = $(document);
    this.$context = $(this.context);

    // tracking vars
    this.lastScrollY = this.getScrollY();
    this.isQueued = false;
    this.resizeTicker = 0;
    this.lastFrameWasAnimated = false;

    // feature detection
    win.requestAnimationFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame;
    this.raf = !!win.requestAnimationFrame;

    // auto-initialize if manual option is falsy
    if (!this.manualInit) {
        this.init();
    }

}

$.extend(ScrollTie.prototype, {

    init: function() {
        var _this = this;

        this.isInitialized = true;
        this.propertyUpdater = propertyUpdaterFactory.create(this.el, this.options);

        // calculated vals
        this.isFixed = this.$el.css('position') == 'fixed';
        this.calculatedDelay = this.calculateDelay();

        // call animate to position things
        var animate = this.canAnimate() ? this.animate() :

        // allows a plugin to know when the initial animation is finished
        this.promise = this.canAnimate() ? this.animate() : $.Deferred().resolve();

        // always listen to the specified event
        this.$context.on(this.evt + '.' + this.id, this.scrollHandler.bind(this));

        // reset on win resize
        this.$win.on('resize.' + this.id, function(e){
            _this.resizeTicker++;
            _this.resetPosition(_this.resizeTicker);
        });
    },

    scrollHandler: function() {
        this.lastScrollY = this.getScrollY();
        this.requestAnimation();
    },

    requestAnimation: function() {
        // if page is overscrolled, return
        if (this.$win.height() + this.lastScrollY > this.$doc.height()) return;

        // first check if animation is possible
        if (!this.canAnimate()) {
            if (this.lastFrameWasAnimated) this.propertyUpdater.reset();
            this.lastFrameWasAnimated = false;
            return;
        }

        // fall back on no debounce if raf is unsupported
        if (!this.raf) {
            this.animate();
            return;
        }

        // use raf if possible to request animation frame
        if (!this.isQueued) {
            win.requestAnimationFrame(this.animate.bind(this));
            this.isQueued = true;
        }
    },

    animate: function() {
        this.isQueued = false;

        if (!this.lastFrameWasAnimated) this.propertyUpdater.onStart(this.el);

        var moveValue = this.calculateMoveValue();

        // sets new property value with check for transform/prefix requirements
        this.propertyUpdater.update(moveValue);

        this.lastFrameWasAnimated = true;
    },

    canAnimate: function() {
        var inView = elementIsInView(this.el, this.lastScrollY);

        var cannotAnimate = this.paused || !inView && !this.animateWhenOutOfView && !this.isFixed || this.lastScrollY < this.calculatedDelay;

        return !cannotAnimate;
    },

    getScrollY: function() {
        return this.$context.scrollTop();
    },

    calculateDelay: function() {
        var offset = this.$el.offset().top;
            offset = offset > win.innerHeight && !this.isFixed ? offset - win.innerHeight : 0;

        var delay = typeof this.delay == 'function' ? this.delay(this.el) : this.delay;

        return delay === undefined ? offset : delay + offset;
    },

    calculateMoveValue: function() {
        return (this.lastScrollY - this.calculatedDelay) * this.propertyUpdater.speed;
    },

    resetPosition: function(ticker) {
        var _this = this;

        // debounce until resize is over
        setTimeout(function(){
            if (ticker == _this.resizeTicker) {
                _this.refresh();
            }
        }, 500);
    },

    pause: function() {
        this.propertyUpdater.pause();
    },

    start: function() {
        this.propertyUpdater.start();
        this.calculatedDelay = this.lastScrollY;
    },

    destroy: function(list) {
        // remove evt listeners
        this.$context.off('.' + this.id);
        this.$win.off('.' + this.id);

        // remove inline styles from plugin
        this.propertyUpdater.clearProperty();

        // remove data from jQuery el and instance
        $.removeData(this.el, 'plugin_scrollTie');
        list.splice(list.indexOf(this), 1);

        // set initialized status to false
        this.isInitialized = false;

        // call onDestroy option
        this.onDestroy(this.el);
    },

    refresh: function() {
        this.propertyUpdater.clearProperty();
        this.init();
    }

});
