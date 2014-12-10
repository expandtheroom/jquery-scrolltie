/*-------------------------------------------- */
/** Exports */
/*-------------------------------------------- */

module.exports = OpacityPropertyUpdater;

/*-------------------------------------------- */
/** Requires */
/*-------------------------------------------- */

var PropertyUpdater = require('./propertyUpdater'),
    extend = require('../helpers/extend');

/*-------------------------------------------- */
/** Extends PropertyUpdater with custom login */
/** required by Opacity
/*-------------------------------------------- */

function OpacityPropertyUpdater(element, opts) {
    this.backgroundPositionAxis = opts.property;

    PropertyUpdater.call(this, element, opts);

    this.stopAtValue = this.reverseDirection ? 0 : 1;
}

extend(PropertyUpdater, OpacityPropertyUpdater, {
    _createPropertyValueFormatter: function() {
        return function(moveValue) {
            return moveValue;
        };
    },

    _getSpeed: function() {
        var speed = this.opts.speed || 1;

        return speed * 0.001;
    }
});