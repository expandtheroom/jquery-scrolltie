/**
 * ScrollTie: Ties a CSS property to user scroll (common use is Parallax animation)
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($){

    'use strict';

    /*-------------------------------------------- */
    /** Variables */
    /*-------------------------------------------- */

    var win = window;
    
    var allScrollTiedElements = [],
        scrollTiedElementCounter = 0,
        publicGlobalMethods,
        publicInstanceMethods;

        var specialPropertiesMap = {
            translateY: 'transform',
            translateX: 'transform',
            rotate: 'transform',
            scale: 'transform',
            backgroundPositionY: 'backgroundPosition',
            backgroundPositionX: 'backgroundPosition'
        };

        var vendorPrefixes = ['-ms-', '-webkit-'];

    function ScrollTie(element, opts, undefined) {
        this.id = opts.id;
        this.el = typeof element === 'string' ? document.querySelector(element) : element;

        // jquery elements
        this.$el = $(element);
        this.container = opts.container? this.$el.parents(opts.container)[0] : undefined;

        // bool options
        this.animateWhenOutOfView = opts.animateWhenOutOfView;
        this.reverseDirection = opts.reverseDirection;
        
        // handle special CSS property option, default to value of property option
        this.property = specialPropertiesMap[opts.property] || opts.property;

        this.transform = this.property === 'transform' ? opts.property : null;
        this.backgroundPositionAxis = this.property === 'backgroundPosition' ? opts.property : null;

        // custom event and context defaults
        this.evt = opts.evt || 'scroll';
        this.context = opts.context || win;

        // motion property values
        this.speed = opts.speed || 1;
        this.delay = opts.delay;
        this.stopAtValue = opts.stopAtValue;
        this.originalVal = opts.originalVal;

        // callback options
        this.propertyValueFormat = opts.propertyValueFormat;
        this.afterStop = opts.afterStop || $.noop;
        this.onPause = opts.onPause || $.noop;
        this.onStart = opts.onStart || $.noop;
        this.onDestroy = opts.onDestroy || $.noop;

        // cache jQuery objects
        this.$win = $(win);
        this.$doc = $(document);
        this.$context = $(this.context);

        // tracking vars
        this.lastScrollY = this.getScrollY();
        this.isQueued = false;
        this.paused = false;
        this.stopped = false;
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

            // calculated vals
            this.isFixed = this.$el.css('position') == 'fixed';
            this.originalVal = this.originalVal !== undefined ? this.originalVal : this.calculateOriginalVal();
            this.propertyValueFormat = typeof this.propertyValueFormat === 'function' ? this.propertyValueFormat : (this.transform || this.backgroundPositionAxis) ? this.getSpecialPropertyValueFormat(this.transform || this.backgroundPositionAxis) : null;
            this.calculatedDelay = this.calculateDelay();
            this.staticTransformValue = this.getStaticTransformValue();


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
            var isOverscrolled = this.$win.height() + this.lastScrollY > this.$doc.height();

            if (isOverscrolled) return;

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
                win.requestAnimationFrame(this.animate.bind(this));
                this.isQueued = true;
            }
        },

        canAnimate: function() {
            var inViewElement = this.container || this.el;
            var inView = this.elementIsInView(inViewElement, 800);

            var cannotAnimate = this.paused || !inView && !this.animateWhenOutOfView && !this.isFixed || this.lastScrollY < this.calculatedDelay;

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

            // sets new property value with check for transform/prefix requirements
            this.updatePropertyValue(moveValue);

            // if stopped, keep track of when to un-stop
            if (this.stopped) this.checkforRestart();

            this.lastFrameWasAnimated = true;
        },

        animateTo: function(newPosition) {
            var self = this;
            this.originalVal = [newPosition];

            if (this.propertyValueFormat) {
                newPosition = this.propertyValueFormat(this.el, newPosition);
            }

            // sets new property value with check for transform/prefix requirements
            this.updatePropertyValue(newPosition);

        },

        getScrollY: function() {
            return this.$context.scrollTop();
        },

        updatePropertyValue: function(moveValue) {
            var _this = this;

            if (this.transform) {
                var transformValueWithPrefixes = {
                    transform: _this.staticTransformValue + ' ' + moveValue
                };

                $.each(vendorPrefixes, function(i, prefix) {
                    transformValueWithPrefixes[prefix + 'transform'] = _this.staticTransformValue + ' ' + moveValue;
                });

                this.$el.css(transformValueWithPrefixes);
            } else {
                this.$el.css(this.property, moveValue);
            }
        },

        getStaticTransformValue: function() {
            var transformValue = '';

            var matrixValues = parse2dTransformMatrix(this.el);

            for (var key in matrixValues) {
                var propertyValueFormat = this.getSpecialPropertyValueFormat(key);

                if (matrixValues[key] && key !== this.transform) {
                    transformValue = transformValue + ' ' + propertyValueFormat(this.el, matrixValues[key]);
                }
            }

            return transformValue;
        },

        getSpecialPropertyValueFormat: function(specialProperty) {
            var _this = this;

            var propertyValueFormat;

            switch (specialProperty) {

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
                case ('backgroundPositionX'):
                    propertyValueFormat = function(el, moveValue) {
                        var yPos = getComputedStyle(el) ? getComputedStyle(el).backgroundPosition.split(' ')[1] : 0;

                        return moveValue + 'px ' + yPos;
                    };
                    break;
                case ('backgroundPositionY'):
                    propertyValueFormat = function(el, moveValue) {
                        var xPos = getComputedStyle(el) ? getComputedStyle(el).backgroundPosition.split(' ')[0] : 0;

                        return xPos + ' ' + moveValue + 'px';
                    };
                    break;
                default:
                    propertyValueFormat = null;
            }

            return propertyValueFormat;

        },

        calculateOriginalVal: function() {
            var _this = this;

            if (!this.transform && !this.backgroundPositionAxis) return parseInt(this.$el.css(this.property)) || 0;

            if (this.backgroundPositionAxis) {
                var bgPosition = getComputedStyle(this.el) ? getComputedStyle(this.el).backgroundPosition.split(' ') : [0,0];

                return this.backgroundPositionAxis === 'backgroundPositionY' ? parseInt(bgPosition[1]) : parseInt(bgPosition[0]);
            } 

            var transformValues = parse2dTransformMatrix(_this.el);

            return parseInt(transformValues && transformValues[this.transform] ? transformValues[this.transform] : 0);
        },

        calculateDelay: function() {
            var offset = this.$el.offset().top;
                offset = offset > win.innerHeight && !this.isFixed ? offset - win.innerHeight : 0;

            var delay = typeof this.delay == 'function' ? this.delay(this.el) : this.delay;

            return delay === undefined ? offset : delay + offset;
        },

        calculateMoveValue: function() {
            // calculate moveValue
            var moveValue = (this.lastScrollY - this.calculatedDelay) * this.speed;

            // modify if transform is scale to feel more logical to user
            if (this.transform == 'scale') moveValue = moveValue * 0.01;

            // modify based on direction
            moveValue = this.reverseDirection ? Number(this.originalVal) - moveValue : Number(this.originalVal) + moveValue;
            
            // stop moving at value if specified
            if (this.stopAtValue !== undefined) {
                moveValue = this.checkForStop(moveValue);
            }

            // floor value to integer unless transform is scale
            return (this.transform == 'scale') ? moveValue : Math.floor(moveValue);
        },

        checkForStop: function(moveValue) {
            switch (this.originalVal < this.stopAtValue) {
                case true: 
                    if (moveValue >= this.stopAtValue){
                        moveValue = this.stopAtValue;
                        this.stopped = true;
                        this.afterStop(this.el);
                    }
                    break;
                case false:
                    if (moveValue <= this.stopAtValue){
                        moveValue = this.stopAtValue;
                        this.afterStop(this.el);
                        this.stopped = true;
                    }
                    break;
                }

            return moveValue;
        },

        checkforRestart: function(moveValue) {
            if (this.originalVal < this.stopAtValue && moveValue <= this.stopAtValue) {
                this.onStart(this.el);
                this.stopped = false;
            } else if (this.originalVal > this.stopAtValue && moveValue >= this.stopAtValue) {
                this.onStart(this.el);
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

            var winHeight = win.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
                totalScroll = this.lastScrollY + winHeight,
                elOffsetTop = el.offsetTop,
                elHeight = el.clientHeight;

            var isInView = elOffsetTop <= (totalScroll + buffer) && (totalScroll < (elOffsetTop + elHeight + winHeight + buffer));

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

        clearProperty: function() {
            var _this = this;

            this.$el.css(this.property, '');
            
            if (this.transform) {
                $.each(vendorPrefixes, function(i, prefix) {
                    _this.$el.css(prefix + 'transform', '');
                });
            }
        },

        pause: function() {
            this.paused = true;
            this.onPause(this.el);
        },

        start: function() {
            this.paused = false;
            this.originalVal = this.calculateOriginalVal();
            this.calculatedDelay = this.lastScrollY;
            this.onStart(this.el);
        },

        destroy: function() {
            // remove evt listeners
            this.$context.off('.' + this.id);
            this.$win.off('.' + this.id);

            // remove inline styles from plugin
            this.clearProperty();

            // remove data from jQuery el and instance
            $.removeData(this.el, 'plugin_scrollTie');
            allScrollTiedElements.splice(allScrollTiedElements.indexOf(this), 1);

            // call onDestroy option
            this.onDestroy(this.el);
        },

        refresh: function() {
            this.clearProperty();
            this.init();
        }

    });

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
                return $.error('ScrollTie does\'t recognize the method ' + method);
            }
        }

        return this.each(function () {
            options.id = 'scrollTied' + scrollTiedElementCounter++;

            if (!$.data(this, 'plugin_scrollTie')) {
                $.data(this, 'plugin_scrollTie',
                allScrollTiedElements[0] = new ScrollTie( this, options ));
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

}));