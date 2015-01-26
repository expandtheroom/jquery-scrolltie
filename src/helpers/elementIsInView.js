/*-------------------------------------------- */
/** Helper to determine if an element is visible */
/*-------------------------------------------- */

var $ = require('jquery');

module.exports = function(el, scrollY, buffer) {
    buffer = buffer || 100;

    var $win = $(window),
        $el = $(el),
        documentHeight = $(document).height();

    var winHeight = $win.innerHeight(),
        totalScroll = scrollY + winHeight,
        elOffsetTop = $el.offset().top,
        elHeight = $el.innerHeight();

    var isInView = elOffsetTop <= (totalScroll + buffer) && (totalScroll < (elOffsetTop + elHeight + winHeight + buffer));

    return isInView;
};