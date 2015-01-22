/*-------------------------------------------- */
/** Helper to use Object.create with $.extend */
/*-------------------------------------------- */

var $ = require('jquery');

module.exports = function(parent, child, methods) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;

    $.extend(child.prototype, methods);
};