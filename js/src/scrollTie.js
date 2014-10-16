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
        this.el = typeof element === 'string' ? document.querySelector(element) : element;
        
        if (!this.el) return;

        // jquery elements
        this.$el = $(element);
        this.container = opts.container? this.$el.parents(opts.container)[0] : undefined;

        // support for CSS3 transforms
        this.supportedTransforms = ['translateX', 'translateY', 'rotate', 'scale'];

        // bool options
        this.animateWhenOutOfView = opts.animateWhenOutOfView;
        
        // value options
        this.evt = opts.evt || 'scroll';
        this.context = opts.context || window;
        this.property = this.supportedTransforms.indexOf(opts.property) !== -1 ? 'transform' : opts.property;
        this.transform = this.property === 'transform' ? opts.property : null;
        this.reverseDirection = opts.reverseDirection;
        this.speed = opts.speed || 1;
        this.delay = opts.delay;
        this.stopAtValue = opts.stopAtValue;
        this.originalVal = opts.originalVal;

        // callback options
        this.propertyValueFormat = opts.propertyValueFormat;
        this.onStop = opts.onStop || $.noop;
        this.onPause = opts.onPause || $.noop;
        this.onStart = opts.onStart || $.noop;
        this.onDestroy = opts.onDestroy || $.noop;

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

    $.extend(ScrollTie.prototype, {
        
        init: function() {
            var self = this;

            this.destroyed = false;

            // calculated vals
            this.isFixed = this.$el.css('position') == 'fixed';
            this.originalVal = this.originalVal !== undefined ? this.originalVal : this.calculateOriginalVal();
            this.propertyValueFormat = typeof this.propertyValueFormat === 'function' ? this.propertyValueFormat : this.transform ? this.getTransformPropertyValueFormat() : null;
            this.calculatedDelay = this.calculateDelay();

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

            // fall back on no debounce if raf is unsupported
            if (!this.raf) {
                this.animate();
                return;
            } 

            // use raf if possible to request animation frame
            if (!this.isQueued) {
                window.requestAnimationFrame(this.animate.bind(this));
                this.isQueued = true;
            }
        },

        canAnimate: function() {
            var inViewElement = this.container || this.el;
            var inView = this.elementIsInView(inViewElement, 800);

            var cannotAnimate = this.destroyed || this.paused || !inView && !this.animateWhenOutOfView && !this.isFixed || this.lastScrollY < this.calculatedDelay;

            return !cannotAnimate;
        },

        animate: function() {
            this.isQueued = false;

            if (!this.lastFrameWasAnimated) this.onStart(this.el);
            
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

        getScrollY: function() {
            return this.$context.scrollTop();
        },

        getTransformPropertyValueFormat: function() {

            var propertyValueFormat;

            switch (this.transform) {

                case 'translateX':
                    propertyValueFormat = function(el, moveValue) {
                        return 'translateX(' + moveValue + 'px)';
                    };
                    break;
                case 'translateY':
                    propertyValueFormat = function(el, moveValue) {
                        return 'translateY(' + moveValue + 'px)';
                    };
                    break;
                case 'rotate':
                    propertyValueFormat = function(el, moveValue) {
                        return 'rotate(' + moveValue + 'deg)';
                    };
                    break;
                case 'scale':
                    propertyValueFormat = function(el, moveValue) {
                        return 'scale(' + moveValue + ')';
                    };
                    break;
                default:
                    propertyValueFormat = null;
            }

            return propertyValueFormat;

        },

        calculateOriginalVal: function() {
            var _this = this;

            if (!this.transform) return parseInt(this.$el.css(this.property)) || 0;

            var transformValues = parse2dTransformMatrix(_this.el);

            return parseInt(transformValues && transformValues[this.transform] ? transformValues[this.transform] : 0);
        },

        calculateDelay: function() {
            var offset = this.isFixed ? 0 : this.$el.offset().top;
                offset = offset > window.innerHeight ? offset - window.innerHeight : 0;

            var delay = typeof this.delay == 'function' ? this.delay(this.el) : this.delay;

            return delay === undefined ? offset : delay + offset;
        },

        calculateMoveValue: function() {
            // calculate moveValue
            var moveValue = (this.lastScrollY - this.calculatedDelay) * this.speed;

            // modify based on direction
            moveValue = this.reverseDirection ? Number(this.originalVal) - moveValue : Number(this.originalVal) + moveValue;
            
            // stop moving at value if specified
            if (this.stopAtValue !== undefined) {
                moveValue = this.checkForStop(moveValue);
            }

            return Math.floor(moveValue);
        },

        checkForStop: function(moveValue) {
            switch (this.originalVal < this.stopAtValue) {
                case true: 
                    if (moveValue >= this.stopAtValue){
                        moveValue = this.stopAtValue;
                        this.stopped = true;
                        this.onStop(this.el);
                    }
                    break;
                case false:
                    if (moveValue <= this.stopAtValue){
                        moveValue = this.stopAtValue;
                        this.onStop(this.el);
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

        pause: function() {
            this.paused = true;
            this.originalVal = this.getOriginalVal ? [this.getOriginalVal(this.$el[0])] : this.calculateOriginalVal();
            this.onPause(this.el);
        },

        start: function() {
            this.paused = false;
            this.onStart(this.el);
        },

        destroy: function() {
            this.destroyed = true;
            this.$el.css(this.property, '');
            this.onDestroy(this.el);
        },

        refresh: function() {
            this.destroy();
            this.init();
        }

    });

    function parse2dTransformMatrix(el) {
        var styles = window.getComputedStyle(el, null);

        if (!el || !styles) return;

        var matrixString = styles.getPropertyValue('-webkit-transform') ||
                           styles.getPropertyValue('-moz-transform') ||
                           styles.getPropertyValue('-ms-transform') ||
                           styles.getPropertyValue('-o-transform') ||
                           styles.getPropertyValue('transform');

        var matrixValues = matrixString.replace(/[matrix\(\)]/g, '').split(',');

        var a = matrixValues[0],
            b = matrixValues[1],
            c = matrixValues[2],
            d = matrixValues[3],
            xTranslate = matrixValues[4],
            yTranslate = matrixValues[5];

        var scale = Math.sqrt(a*a + b*b),
            sin = b/scale;

        var rotation = Math.round(Math.atan2(b, a) * (180/Math.PI));

        return {
            rotation: rotation,
            scale: scale,
            xTranslate: xTranslate,
            yTranslate: yTranslate
        };
    }

}(jQuery, window));