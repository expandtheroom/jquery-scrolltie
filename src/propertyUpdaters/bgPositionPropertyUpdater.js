/*-------------------------------------------- */
/** Exports */
/*-------------------------------------------- */

module.exports = BgPositionPropertyUpdater;

/*-------------------------------------------- */
/** Requires */
/*-------------------------------------------- */

var $ = require('jquery');

var PropertyUpdater = require('./propertyUpdater'),
    extend = require('../helpers/extend');

/*-------------------------------------------- */
/** Extends PropertyUpdater with custom login */
/** required by Background Position
/*-------------------------------------------- */

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