/*-------------------------------------------- */
/** Simple Factory to create PropertyUpdaters */
/** Add more as special support is needed
/*-------------------------------------------- */

var PropertyUpdater = require('./propertyUpdater'),
    TransformPropertyUpdater = require('./transformPropertyUpdater'),
    BgPositionPropertyUpdater = require('./bgPositionPropertyUpdater'),
    OpacityPropertyUpdater = require('./opacityPropertyUpdater');

module.exports.create = function(element, opts) {
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