(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * ScrollTie: Ties a CSS property to user scroll (common use is Parallax animation)
 */
(function($){

    'use strict';

    /*-------------------------------------------- */
    /** Variables */
    /*-------------------------------------------- */

    var win = window;
    
    var allScrollTiedElements = [],
        scrollTiedElementCounter = 0,
        publicGlobalMethods,
        publicInstanceMethods;

    var vendorPrefixes = ['-ms-', '-webkit-'],
        vendorPrefixCount = vendorPrefixes.length;


    /*-------------------------------------------- */
    /** Property Updaters */
    /*-------------------------------------------- */
    
    function PropertyUpdater(element, opts) {
        this.opts = opts;

        this.el = element;
        this.$el = $(element);

        this.property = this._getProperty();
        this.reverseDirection = opts.reverseDirection;
        this.speed = this._getSpeed();
        this.stopAtValue = opts.stopAtValue;
        this.originalVal = opts.originalVal !== undefined ? opts.originalVal : this._getOriginalVal();
        this.propertyValueFormat = opts.propertyValueFormat || this._createPropertyValueFormatter();

        //callbacks
        this.afterStop = opts.afterStop || $.noop;
        this.onPause = opts.onPause || $.noop;
        this.onStart = opts.onStart || $.noop;

        // tracking
        this.paused = false;
        this.stopped = false;
    }

    $.extend(PropertyUpdater.prototype, {

        _createPropertyValueFormatter: function() {
            return function(moveValue) {
                return moveValue + 'px';
            };
        },

        _getProperty: function() {
            return this.opts.property;
        },

        _getOriginalVal: function() {
            return parseInt(this.$el.css(this.property)) || 0;
            
        },

        _getSpeed: function() {
            return this.opts.speed || 1;
        },

        _shouldStop: function(moveValue) {
            if (!this.reverseDirection && moveValue >= this.stopAtValue || this.reverseDirection && moveValue <= this.stopAtValue) {
                this.afterStop(this.el);
                this.stopped = true;
                return true;
            }

            return false;
        },

        _checkForRestart: function(moveValue) {
            if ((this.originalVal < this.stopAtValue && moveValue <= this.stopAtValue) || (this.originalVal > this.stopAtValue && moveValue >= this.stopAtValue)) {
                this.onStart(this.el);
                this.stopped = false;
            }
        },

        _transmuteMoveValue: function(moveValue) {
            // modify based on direction
            moveValue = this.reverseDirection ? Number(this.originalVal) - moveValue : Number(this.originalVal) + moveValue;
            
            // stop moving at value if specified
            if (this.stopAtValue !== undefined) {
                moveValue = this._shouldStop(moveValue) ? this.stopAtValue : moveValue;
            }

            // if stopped, check for restart
            if (this.stopped) {
                this._checkForRestart();
            }

            return moveValue;
        },

        _formatJqueryCssVal: function(moveValue) {
            var val = {};

            val[this.property] = this.propertyValueFormat(moveValue);

            return val;
        },

        clearProperty: function() {
            this.$el.css(this.property, '');
        },

        pause: function() {
            this.paused = true;
            this.onPause(this.el);
        },

        start: function() {
            this.paused = false;
            this.originalVal = this._getOriginalVal();
            this.onStart(this.el);
        },

        moveTo: function(newPosition) {
            this.originalVal = newPosition;

            // sets new property value with check for transform/prefix requirements
            this.$el.css(this.property, this.propertyValueFormat(newPosition));
        },

        reset: function() {
            this.moveTo(this.originalVal);
        },

        update: function(moveValue) {
            if (this.paused) return;

            moveValue = this._transmuteMoveValue(moveValue);

            this.$el.css(this._formatJqueryCssVal(moveValue));
        }

    });

    function TransformPropertyUpdater(element, opts) {
        this.transform = opts.property;
        this.propertyValueFormatMap = {
            translateX: function(moveValue) {
                return 'translateX(' + moveValue + 'px)';
            },
            translateY: function(moveValue) {
                return 'translateY(' + moveValue + 'px)';
            },
            rotate: function(moveValue) {
                return 'rotate(' + moveValue + 'deg)';
            },
            scale: function(moveValue) {
                return 'scale(' + moveValue + ')';
            }
        };
        
        PropertyUpdater.call(this, element, opts);
        
        this.staticTransformValue = this._getStaticTransformValue();
    }

    extend(PropertyUpdater, TransformPropertyUpdater, {
        _createPropertyValueFormatter: function() {
            return this.propertyValueFormatMap[this.transform];
        },

        _getProperty: function() {
            return 'transform';
        },

        _getSpeed: function() {
            return this.transform == 'scale' ? this.opts.speed * 0.01 : this.opts.speed;
        },

        _getOriginalVal: function() {
            var transformValues = parse2dTransformMatrix(this.el);
            return parseInt(transformValues && transformValues[this.transform] ? transformValues[this.transform] : 0);
        },

        _getStaticTransformValue: function() {
            var transformValue = '';

            var matrixValues = parse2dTransformMatrix(this.el);

            for (var key in matrixValues) {

                if (matrixValues[key] && key != this.transform) {
                    transformValue = transformValue + ' ' + this.propertyValueFormatMap[key](matrixValues[key]);
                }
            }

            return transformValue;
        },

        _formatJqueryCssVal: function(moveValue) {
            moveValue = this.propertyValueFormat((this.transform == 'scale') ? moveValue : Math.floor(moveValue));

            var transformValueWithPrefixes = {
                transform: this.staticTransformValue + ' ' + moveValue
            };

            for (var i = 0; i < vendorPrefixCount; i++) {
                transformValueWithPrefixes[vendorPrefixes[i] + 'transform'] = this.staticTransformValue + ' ' + moveValue;
            }

            return transformValueWithPrefixes;
        },

        clearProperty: function() {
            var _this = this;

            $.each(vendorPrefixes, function(i, prefix) {
                _this.$el.css(prefix + 'transform', '');
            });

            PropertyUpdater.prototype.clearProperty.call(this);
        }

    });

    function BgPositionPropertyUpdater(element, opts) {
        this.backgroundPositionAxis = opts.property;

        PropertyUpdater.call(this, element, opts);
    }

    extend(PropertyUpdater, BgPositionPropertyUpdater, {
        _createPropertyValueFormatter: function() {
            var propertyValueFormatMap = {
                backgroundPositionX: function(moveValue) {
                    var yPos = getComputedStyle(this.el) ? getComputedStyle(this.el).backgroundPosition.split(' ')[1] : 0;

                    return moveValue + 'px ' + yPos;
                },
                backgroundPositionY: function(moveValue) {
                    var xPos = getComputedStyle(this.el) ? getComputedStyle(this.el).backgroundPosition.split(' ')[0] : 0;

                    return xPos + ' ' + moveValue + 'px';
                }
            };

            return propertyValueFormatMap[this.backgroundPositionAxis];
        },

        _getProperty: function() {
            return 'backgroundPosition';
        },

        _getOriginalVal: function() {
            var bgPosition = getComputedStyle(this.el) ? getComputedStyle(this.el).backgroundPosition.split(' ') : [0,0];

            return this.backgroundPositionAxis === 'backgroundPositionY' ? parseInt(bgPosition[1]) : parseInt(bgPosition[0]);
        }
    });

    function createPropertyUpdater(element, opts) {
        var specialPropertiesMap = {
            translateY: TransformPropertyUpdater,
            translateX: TransformPropertyUpdater,
            rotate: TransformPropertyUpdater,
            scale: TransformPropertyUpdater,
            backgroundPositionY: BgPositionPropertyUpdater,
            backgroundPositionX: BgPositionPropertyUpdater
        };

        return specialPropertiesMap[opts.property] ? new specialPropertiesMap[opts.property](element, opts) : new PropertyUpdater(element, opts);
    }

    /*-------------------------------------------- */
    /** ScrollTie */
    /*-------------------------------------------- */

    function ScrollTie(element, opts, undefined) {
        this.options = opts;

        this.id = opts.id;
        this.el = typeof element === 'string' ? document.querySelector(element) : element;

        // jquery elements
        this.$el = $(element);
        this.container = opts.container? this.$el.parents(opts.container)[0] : undefined;

        // options
        this.animateWhenOutOfView = opts.animateWhenOutOfView;
        this.delay = opts.delay;

        // custom event and context defaults
        this.evt = opts.evt || 'scroll';
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
        if (!opts.manualInit) {
            this.init();        
        }

    }

    $.extend(ScrollTie.prototype, {
        
        init: function() {
            var _this = this;

            this.propertyUpdater = createPropertyUpdater(this.el, this.options);

            // calculated vals
            this.isFixed = this.$el.css('position') == 'fixed';
            this.calculatedDelay = this.calculateDelay();

            // call animate to position things
            if (this.canAnimate()) this.animate();

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
            var inViewElement = this.container || this.el;
            var inView = this.elementIsInView(inViewElement);

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

        elementIsInView: function(el, buffer) {
            buffer = buffer || 100;

            var body = document.body,
                documentElement = document.documentElement;

            var documentHeight = Math.max(
                body.scrollHeight, documentElement.scrollHeight,
                body.offsetHeight, documentElement.offsetHeight,
                body.clientHeight, documentElement.clientHeight
            );

            var winHeight = win.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                totalScroll = this.lastScrollY + winHeight,
                elOffsetTop = el.offsetTop,
                elHeight = el.clientHeight;

            var isInView = elOffsetTop <= (totalScroll + buffer) && (totalScroll < (elOffsetTop + elHeight + winHeight + buffer));

            return isInView;
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

        destroy: function() {
            // remove evt listeners
            this.$context.off('.' + this.id);
            this.$win.off('.' + this.id);

            // remove inline styles from plugin
            this.propertyUpdater.clearProperty();

            // remove data from jQuery el and instance
            $.removeData(this.el, 'plugin_scrollTie');
            allScrollTiedElements.splice(allScrollTiedElements.indexOf(this), 1);

            // call onDestroy option
            this.onDestroy(this.el);
        },

        refresh: function() {
            this.propertyUpdater.clearProperty();
            this.init();
        }

    });

    /*-------------------------------------------- */
    /** Helpers */
    /*-------------------------------------------- */

    function parse2dTransformMatrix(el) {
        var styles = win.getComputedStyle(el, null);

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
            rotate: parseInt(rotation),
            scale: scale,
            translateX: parseInt(xTranslate),
            translateY: parseInt(yTranslate)
        };
    }

    function extend(parent, child, methods) {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;

        $.extend(child.prototype, methods);
    }

    /*-------------------------------------------- */
    /** Methods to Expose on jQuery */
    /*-------------------------------------------- */
    
    publicGlobalMethods = {
        destroy: function() {
            $.each(allScrollTiedElements, function(i, scrollTie) {
                scrollTie.destroy();
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
        }
    };

    /*-------------------------------------------- */
    /** Methods to Expose on jQuery object of Element */
    /*-------------------------------------------- */
    
    publicInstanceMethods = {
        destroy: function() {
            this.destroy();
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

})(jQuery);
},{}]},{},[1]);
