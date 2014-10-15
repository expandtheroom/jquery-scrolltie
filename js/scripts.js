function FastClick(a){"use strict";var b,c=this;if(this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=10,this.layer=a,!a||!a.nodeType)throw new TypeError("Layer must be a document node");this.onClick=function(){return FastClick.prototype.onClick.apply(c,arguments)},this.onMouse=function(){return FastClick.prototype.onMouse.apply(c,arguments)},this.onTouchStart=function(){return FastClick.prototype.onTouchStart.apply(c,arguments)},this.onTouchMove=function(){return FastClick.prototype.onTouchMove.apply(c,arguments)},this.onTouchEnd=function(){return FastClick.prototype.onTouchEnd.apply(c,arguments)},this.onTouchCancel=function(){return FastClick.prototype.onTouchCancel.apply(c,arguments)},FastClick.notNeeded(a)||(this.deviceIsAndroid&&(a.addEventListener("mouseover",this.onMouse,!0),a.addEventListener("mousedown",this.onMouse,!0),a.addEventListener("mouseup",this.onMouse,!0)),a.addEventListener("click",this.onClick,!0),a.addEventListener("touchstart",this.onTouchStart,!1),a.addEventListener("touchmove",this.onTouchMove,!1),a.addEventListener("touchend",this.onTouchEnd,!1),a.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(a.removeEventListener=function(b,c,d){var e=Node.prototype.removeEventListener;"click"===b?e.call(a,b,c.hijacked||c,d):e.call(a,b,c,d)},a.addEventListener=function(b,c,d){var e=Node.prototype.addEventListener;"click"===b?e.call(a,b,c.hijacked||(c.hijacked=function(a){a.propagationStopped||c(a)}),d):e.call(a,b,c,d)}),"function"==typeof a.onclick&&(b=a.onclick,a.addEventListener("click",function(a){b(a)},!1),a.onclick=null))}FastClick.prototype.deviceIsAndroid=navigator.userAgent.indexOf("Android")>0,FastClick.prototype.deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent),FastClick.prototype.deviceIsIOS4=FastClick.prototype.deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent),FastClick.prototype.deviceIsIOSWithBadTarget=FastClick.prototype.deviceIsIOS&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent),FastClick.prototype.needsClick=function(a){"use strict";switch(a.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(a.disabled)return!0;break;case"input":if(this.deviceIsIOS&&"file"===a.type||a.disabled)return!0;break;case"label":case"video":return!0}return/\bneedsclick\b/.test(a.className)},FastClick.prototype.needsFocus=function(a){"use strict";switch(a.nodeName.toLowerCase()){case"textarea":case"select":return!0;case"input":switch(a.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}},FastClick.prototype.sendClick=function(a,b){"use strict";var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur(),d=b.changedTouches[0],c=document.createEvent("MouseEvents"),c.initMouseEvent("click",!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),c.forwardedTouchEvent=!0,a.dispatchEvent(c)},FastClick.prototype.focus=function(a){"use strict";var b;this.deviceIsIOS&&a.setSelectionRange?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()},FastClick.prototype.updateScrollParent=function(a){"use strict";var b,c;if(b=a.fastClickScrollParent,!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c,a.fastClickScrollParent=c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)},FastClick.prototype.getTargetElementFromEventTarget=function(a){"use strict";return a.nodeType===Node.TEXT_NODE?a.parentNode:a},FastClick.prototype.onTouchStart=function(a){"use strict";var b,c,d;if(a.targetTouches.length>1)return!0;if(b=this.getTargetElementFromEventTarget(a.target),c=a.targetTouches[0],this.deviceIsIOS){if(d=window.getSelection(),d.rangeCount&&!d.isCollapsed)return!0;if(!this.deviceIsIOS4){if(c.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;this.lastTouchIdentifier=c.identifier,this.updateScrollParent(b)}}return this.trackingClick=!0,this.trackingClickStart=a.timeStamp,this.targetElement=b,this.touchStartX=c.pageX,this.touchStartY=c.pageY,a.timeStamp-this.lastClickTime<200&&a.preventDefault(),!0},FastClick.prototype.touchHasMoved=function(a){"use strict";var b=a.changedTouches[0],c=this.touchBoundary;return Math.abs(b.pageX-this.touchStartX)>c||Math.abs(b.pageY-this.touchStartY)>c?!0:!1},FastClick.prototype.onTouchMove=function(a){"use strict";return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},FastClick.prototype.findControl=function(a){"use strict";return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},FastClick.prototype.onTouchEnd=function(a){"use strict";var b,c,d,e,f,g=this.targetElement;if(!this.trackingClick)return!0;if(a.timeStamp-this.lastClickTime<200)return this.cancelNextClick=!0,!0;if(this.lastClickTime=a.timeStamp,c=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,this.deviceIsIOSWithBadTarget&&(f=a.changedTouches[0],g=document.elementFromPoint(f.pageX-window.pageXOffset,f.pageY-window.pageYOffset)||g,g.fastClickScrollParent=this.targetElement.fastClickScrollParent),d=g.tagName.toLowerCase(),"label"===d){if(b=this.findControl(g)){if(this.focus(g),this.deviceIsAndroid)return!1;g=b}}else if(this.needsFocus(g))return a.timeStamp-c>100||this.deviceIsIOS&&window.top!==window&&"input"===d?(this.targetElement=null,!1):(this.focus(g),this.deviceIsIOS4&&"select"===d||(this.targetElement=null,a.preventDefault()),!1);return this.deviceIsIOS&&!this.deviceIsIOS4&&(e=g.fastClickScrollParent,e&&e.fastClickLastScrollTop!==e.scrollTop)?!0:(this.needsClick(g)||(a.preventDefault(),this.sendClick(g,a)),!1)},FastClick.prototype.onTouchCancel=function(){"use strict";this.trackingClick=!1,this.targetElement=null},FastClick.prototype.onMouse=function(a){"use strict";return this.targetElement?a.forwardedTouchEvent?!0:a.cancelable?!this.needsClick(this.targetElement)||this.cancelNextClick?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0:!0},FastClick.prototype.onClick=function(a){"use strict";var b;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===a.target.type&&0===a.detail?!0:(b=this.onMouse(a),b||(this.targetElement=null),b)},FastClick.prototype.destroy=function(){"use strict";var a=this.layer;this.deviceIsAndroid&&(a.removeEventListener("mouseover",this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0)),a.removeEventListener("click",this.onClick,!0),a.removeEventListener("touchstart",this.onTouchStart,!1),a.removeEventListener("touchmove",this.onTouchMove,!1),a.removeEventListener("touchend",this.onTouchEnd,!1),a.removeEventListener("touchcancel",this.onTouchCancel,!1)},FastClick.notNeeded=function(a){"use strict";var b;if("undefined"==typeof window.ontouchstart)return!0;if(/Chrome\/[0-9]+/.test(navigator.userAgent)){if(!FastClick.prototype.deviceIsAndroid)return!0;if(b=document.querySelector("meta[name=viewport]"),b&&-1!==b.content.indexOf("user-scalable=no"))return!0}return"none"===a.style.msTouchAction?!0:!1},FastClick.attach=function(a){"use strict";return new FastClick(a)},"undefined"!=typeof define&&define.amd?define(function(){"use strict";return FastClick}):"undefined"!=typeof module&&module.exports?(module.exports=FastClick.attach,module.exports.FastClick=FastClick):window.FastClick=FastClick;;/*!
 * Smooth Scroll - v1.4.11 - 2013-07-15
 * https://github.com/kswedberg/jquery-smooth-scroll
 * Copyright (c) 2013 Karl Swedberg
 * Licensed MIT (https://github.com/kswedberg/jquery-smooth-scroll/blob/master/LICENSE-MIT)
 */
(function(l){function t(l){return l.replace(/(:|\.)/g,"\\$1")}var e="1.4.11",o={exclude:[],excludeWithin:[],offset:0,direction:"top",scrollElement:null,scrollTarget:null,beforeScroll:function(){},afterScroll:function(){},easing:"swing",speed:400,autoCoefficent:2,preventDefault:!0},r=function(t){var e=[],o=!1,r=t.dir&&"left"==t.dir?"scrollLeft":"scrollTop";return this.each(function(){if(this!=document&&this!=window){var t=l(this);t[r]()>0?e.push(this):(t[r](1),o=t[r]()>0,o&&e.push(this),t[r](0))}}),e.length||this.each(function(){"BODY"===this.nodeName&&(e=[this])}),"first"===t.el&&e.length>1&&(e=[e[0]]),e};l.fn.extend({scrollable:function(l){var t=r.call(this,{dir:l});return this.pushStack(t)},firstScrollable:function(l){var t=r.call(this,{el:"first",dir:l});return this.pushStack(t)},smoothScroll:function(e){e=e||{};var o=l.extend({},l.fn.smoothScroll.defaults,e),r=l.smoothScroll.filterPath(location.pathname);return this.unbind("click.smoothscroll").bind("click.smoothscroll",function(e){var n=this,s=l(this),c=o.exclude,i=o.excludeWithin,a=0,f=0,h=!0,u={},d=location.hostname===n.hostname||!n.hostname,m=o.scrollTarget||(l.smoothScroll.filterPath(n.pathname)||r)===r,p=t(n.hash);if(o.scrollTarget||d&&m&&p){for(;h&&c.length>a;)s.is(t(c[a++]))&&(h=!1);for(;h&&i.length>f;)s.closest(i[f++]).length&&(h=!1)}else h=!1;h&&(o.preventDefault&&e.preventDefault(),l.extend(u,o,{scrollTarget:o.scrollTarget||p,link:n}),l.smoothScroll(u))}),this}}),l.smoothScroll=function(t,e){var o,r,n,s,c=0,i="offset",a="scrollTop",f={},h={};"number"==typeof t?(o=l.fn.smoothScroll.defaults,n=t):(o=l.extend({},l.fn.smoothScroll.defaults,t||{}),o.scrollElement&&(i="position","static"==o.scrollElement.css("position")&&o.scrollElement.css("position","relative"))),o=l.extend({link:null},o),a="left"==o.direction?"scrollLeft":a,o.scrollElement?(r=o.scrollElement,c=r[a]()):r=l("html, body").firstScrollable(),o.beforeScroll.call(r,o),n="number"==typeof t?t:e||l(o.scrollTarget)[i]()&&l(o.scrollTarget)[i]()[o.direction]||0,f[a]=n+c+o.offset,s=o.speed,"auto"===s&&(s=f[a]||r.scrollTop(),s/=o.autoCoefficent),h={duration:s,easing:o.easing,complete:function(){o.afterScroll.call(o.link,o)}},o.step&&(h.step=o.step),r.length?r.stop().animate(f,h):o.afterScroll.call(o.link,o)},l.smoothScroll.version=e,l.smoothScroll.filterPath=function(l){return l.replace(/^\//,"").replace(/(index|default).[a-zA-Z]{3,4}$/,"").replace(/\/$/,"")},l.fn.smoothScroll.defaults=o})(jQuery);;window.Woods = window.Woods || {};

(function($){
	// utilities
	function translateYValueFormat(el, moveVal) {
		return 'translateY(' + moveVal + 'px)';
	}
	function translateXValueFormat(el, moveVal) {
		return 'translateX(' + moveVal + 'px)';
	}
	function bgPositionFormat(el, moveVal) {
		return '50% ' + moveVal + 'px';
	}

	var backgroundTrees = new Woods.ParallaxElement('#background', {
		property: 'background-position',
		propertyValueFormat: bgPositionFormat,
		originalVal: 0,
		speed: 0.5
	});

	var midgroundTrees = new Woods.ParallaxElement('#midground', {
		property: 'background-position',
		propertyValueFormat: bgPositionFormat,
		originalVal: 0,
		speed: 0.3
	});

	var bird = new Woods.ParallaxElement('.bird', {
		property: 'transform',
		fallbackProperty: 'left',
		propertyValueFormat: translateXValueFormat,
		speed: 1.8,
		animateWhe9OutOfView: true
	});

	var body = new Woods.ParallaxElement('body', {
		property: 'background-position',
		propertyValueFormat: bgPositionFormat,
		speed: 0.8
	});


})(jQuery);;(function($, window){

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

    function parseTransformMatrix(el) {
        var el = el,
            styles = window.getComputedStyle(el, null);

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