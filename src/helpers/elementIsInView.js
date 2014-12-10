/*-------------------------------------------- */
/** Helper to determine if an element is visible */
/*-------------------------------------------- */

module.exports = function(el, scrollY, buffer) {
    buffer = buffer || 100;

    var win = window,
        body = document.body,
        documentElement = document.documentElement;

    var documentHeight = Math.max(
        body.scrollHeight, documentElement.scrollHeight,
        body.offsetHeight, documentElement.offsetHeight,
        body.clientHeight, documentElement.clientHeight
    );

    var winHeight = win.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        totalScroll = scrollY + winHeight,
        elOffsetTop = el.offsetTop,
        elHeight = el.clientHeight;

    var isInView = elOffsetTop <= (totalScroll + buffer) && (totalScroll < (elOffsetTop + elHeight + winHeight + buffer));

    return isInView;
};