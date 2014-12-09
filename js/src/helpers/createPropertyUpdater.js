/*-------------------------------------------- */
/** Simple Factory to create PropertyUpdaters */
/** Add more as special support is needed
/*-------------------------------------------- */

var PropertyUpdater = require('../property-updaters/propertyUpdater'),
    TransformPropertyUpdater = require('../property-updaters/transformPropertyUpdater'),
    BgPositionPropertyUpdater = require('../property-updaters/bgPositionPropertyUpdater'),
    OpacityPropertyUpdater = require('../property-updaters/opacityPropertyUpdater');

module.exports = function(element, opts) {
    var specialPropertiesMap = {
        translateY: TransformPropertyUpdater,
        translateX: TransformPropertyUpdater,
        rotate: TransformPropertyUpdater,
        scale: TransformPropertyUpdater,
        backgroundPositionY: BgPositionPropertyUpdater,
        backgroundPositionX: BgPositionPropertyUpdater,
        opacity: OpacityPropertyUpdater
    };

    return specialPropertiesMap[opts.property] ? new specialPropertiesMap[opts.property](element, opts) : new PropertyUpdater(element, opts);
};