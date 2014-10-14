(function($, window){

    'use strict';

    /*-------------------------------------------- */
    /** Export */
    /*-------------------------------------------- */

    if (typeof exports === 'object') { // Browserify/CommonJS
        module.exports = ScrollTie;
    } else {
        window.ScrollTie = ScrollTie;
    }

    /**
     * ScrollTie: Ties a CSS property to user scroll (common use is Parallax animation)
     * @param {element or string} element   The dom element or selector of the element to be animated on scroll
     * @param {object} opts      Define options for animated element
     */
    
    function ScrollTie(element, opts, undefined) {
        // jquery elements
        this.$el = $(element);
        this.parent = opts.parent? this.$el.parents(opts.parent)[0] : undefined;

        // bool options
        this.animateWhenOutOfView = opts.animateWhenOutOfView;
        
        // value options
        this.evt = opts.evt || 'scroll';
        this.context = opts.context || window;
        this.property = opts.property;
        this.reverseDirection = opts.reverseDirection;
        this.speed = opts.speed || 1;
        this.delay = opts.delay;
        this.stopAtValue = opts.stopAtValue;
        this.originalVal = opts.originalVal; // NOTE: If a propertyValueFormat is provided, an original value is probably necessary as well.

        // function options
        this.valueCalculation = opts.valueCalculation; // NOTE: Value calculations must implement their own SPEED
        this.propertyValueFormat = opts.propertyValueFormat;
        this.stopCallback = opts.stopCallback;

        // cache dom elements
        this.$win = $(window);
        this.$doc = $(document);
        this.$context = $(this.context);

        // tracking vars
        this.lastScrollY = this.getScrollY();
        this.isQueued = false;
        this.paused = false;
        this.stopped = false;
        this.destroyed = false;
        this.resizeTicker = 0;
        this.lastFrameWasAnimated = false;

        // feature detection
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
        this.raf = !!window.requestAnimationFrame;

        if (!opts.manualInit) {
            this.init();        
        }

        // attach subset of methods to element for external use
        this.$el[0].scrollTie = {
            refresh: this.refresh,
            animateTo: this.animateTo
        };
    }

    $.extend(ParallaxElement.prototype, {
        
        init: function() {
            var self = this;

            this.destroyed = false;

            // calculated vals
            this.originalVal = this.originalVal !== undefined ? this.originalVal : this.calculateOriginalVal();

            var offset = this.$el.css('position') == 'fixed' ? 0 : this.$el.offset().top;
            offset = offset > window.innerHeight ? offset - window.innerHeight : 0;

            var delay = typeof this.delay == 'function' ? this.delay.call(this, this.$el) : this.delay;

            this.calculatedDelay = (delay === undefined) ? offset : delay + offset;

            // call animate to position things
            if (this.canAnimate()) this.animate();

            // always listen to the specified event
            this.$context.on(this.evt, $.proxy(this.scrollHandler, this));

            // reset on window resize
            this.$win.on('resize', function(e){
                self.resizeTicker++;
                self.resetPosition(self.resizeTicker);
            });
        },

        scrollHandler: function() {
            this.lastScrollY = this.getScrollY();
            this.requestAnimation();
        },

        requestAnimation: function() {
            // first check if animation is possible
            if (!this.canAnimate()) {
                if (this.lastFrameWasAnimated) this.animateTo(this.originalVal);
                this.lastFrameWasAnimated = false;
                return;
            }
            /*-------------------------------------------- */
            /** Use of RAF in FF results in weird choppiness - taking it away for now */
            /*-------------------------------------------- */
            
            this.animate();
            return;

            /*-------------------------------------------- */
            /** Begin use of RAF */
            /*-------------------------------------------- */

            // fall back on no debounce if raf is unsupported
            // if (!this.raf) {
            // this.animate();
            // return;
            // } 

            // use raf if possible to request animation frame
            // if (!this.isQueued) {
            // window.requestAnimationFrame(this.animate.bind(this));
            // this.isQueued = true;
            // }
        },

        canAnimate: function() {
            var inViewElement = this.parent || this.$el[0];
            var inView = this.elementIsInView(inViewElement, 800);

            var cannotAnimate = this.destroyed || this.paused || !inView && !this.animateWhenOutOfView || this.lastScrollY < this.calculatedDelay;

            return !cannotAnimate;
        },

        animate: function() {
            this.isQueued = false;
            
            var moveValue = this.calculateMoveValue();

            // property value needs custom format
            if (this.propertyValueFormat) {
                moveValue = this.propertyValueFormat(this.$el[0], moveValue);
            }

            // update css property
            this.$el.css(this.property, moveValue);

            if (this.property == 'transform') {
                this.$el.css('-webkit-' + this.property, moveValue);
            }

            // if stopped, keep track of when to un-stop
            if (this.stopped) this.checkforRestart();

            this.lastFrameWasAnimated = true;
        },

        animateTo: function(newPosition) {
            var self = this;
            this.originalVal = [newPosition];

            if (this.propertyValueFormat) {
                newPosition = this.propertyValueFormat(this.$el, newPosition);
            }

            this.$el.css(this.property, newPosition);

            if (this.property == 'transform') {
                this.$el.css('-webkit-' + this.property, newPosition);
            }

        },

        checkForStop: function(moveValue) {
            switch (this.originalVal < this.stopAtValue) {
                case true: 
                    if (moveValue >= this.stopAtValue){
                        moveValue = this.stopAtValue;
                        if (this.stopCallback) this.stopCallback(this.$el);
                        this.stopped = true;
                    }
                    break;
                case false:
                    if (moveValue <= this.stopAtValue){
                        moveValue = this.stopAtValue;
                        if (this.stopCallback) this.stopCallback(this.$el);
                        this.stopped = true;
                    }
                    break;
                }

            return moveValue;
        },

        checkforRestart: function(moveValue) {
            if (this.originalVal < this.stopAtValue && moveValue <= this.stopAtValue) {
                this.stopped = false;
            } else if (this.originalVal > this.stopAtValue && moveValue >= this.stopAtValue) {
                this.stopped = false;
            }
        },

        calculateMoveValue: function() {
            // calculate moveValue
            var moveValue = (this.lastScrollY - this.calculatedDelay) * this.speed;

            // modify based on direction
            moveValue = this.reverseDirection ? Number(this.originalVal) - moveValue : Number(this.originalVal) + moveValue;

            // replace with custom value calculation if given
            if (typeof this.valueCalculation == 'function') moveValue = this.valueCalculation.call(this.$el[0]);
            
            // stop moving at value if specified
            if (this.stopAtValue !== undefined) {
                moveValue = this.checkForStop(moveValue);
            }

            return Math.floor(moveValue);
        },

        calculateOriginalVal: function() {
            var self = this;

            return parseFloat(this.$el.css(this.property)) || 0;
        },

        pause: function() {
            this.paused = true;
            this.originalVal = this.getOriginalVal ? [this.getOriginalVal(this.$el[0])] : this.calculateOriginalVal();
            this.$el.trigger('pause');
        },

        start: function() {
            this.paused = false;
            this.$el.trigger('start');
        },

        destroy: function() {
            this.destroyed = true;
            this.$el.css(this.property, '');
        },

        resetPosition: function(ticker) {
            var self = this;

            // debounce until resize is over
            setTimeout(function(){
                if (ticker == self.resizeTicker) {
                    self.refresh();
                }
            }, 500);
        },

        refresh: function() {
            this.destroy();
            this.init();
        },

        setToWindowHeight: function(el) {
            $(el).css('height', this.$win.height() + 'px');
        },

        getScrollY: function() {
            return this.$context.scrollTop();
        },

        // check if a given el is in view
        
        elementIsInView: function(el, buffer) {

            var body = document.body,
                documentElement = document.documentElement;

            var documentHeight = Math.max(
                body.scrollHeight, documentElement.scrollHeight,
                body.offsetHeight, documentElement.offsetHeight,
                body.clientHeight, documentElement.clientHeight
            );

            var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                totalScroll = this.lastScrollY + windowHeight,
                elOffsetTop = el.offsetTop,
                elHeight = el.clientHeight;

            var isInView = elOffsetTop <= (totalScroll + buffer) && (totalScroll < (elOffsetTop + elHeight + windowHeight + buffer));

            return isInView;
        }
    });

}(jQuery, window));