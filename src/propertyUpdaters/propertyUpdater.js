'use strict';

/*-------------------------------------------- */
/** Requires */
/*-------------------------------------------- */

var $ = require('jquery');

/*-------------------------------------------- */
/** Exports */
/*-------------------------------------------- */

module.exports = PropertyUpdater;

/*-------------------------------------------- */
/** Property Updater (Factory/Faux Abstract Class) */
/*-------------------------------------------- */

function PropertyUpdater(element, opts) {
    this.opts = opts;

    this.el = element;
    this.$el = $(element);

    this.property = this._getProperty();
    this.reverseDirection = opts.reverseDirection;
    this.speed = this._getSpeed();
    this.stopAtValue = typeof opts.stopAtValue === 'function' ? opts.stopAtValue() : opts.stopAtValue;
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
            return Math.floor(moveValue) + 'px';
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

        val[this.property] = this.propertyValueFormat(moveValue, this.el);

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
        this.$el.css(this._formatJqueryCssVal(newPosition));
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
