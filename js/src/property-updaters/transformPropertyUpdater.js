/*-------------------------------------------- */
/** Exports */
/*-------------------------------------------- */

module.exports = TransformPropertyUpdater;


/*-------------------------------------------- */
/** Requires */
/*-------------------------------------------- */

var PropertyUpdater = require('./propertyUpdater'),
    extend = require('../helpers/extend'),
    parse2dTransformMatrix = require('../helpers/parse2dTransformMatrix');

/*-------------------------------------------- */
/** Extends PropertyUpdater with custom logic */
/** required by Transforms
/*-------------------------------------------- */

// Variables
var vendorPrefixes = ['-ms-', '-webkit-'],
    vendorPrefixCount = vendorPrefixes.length;

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
