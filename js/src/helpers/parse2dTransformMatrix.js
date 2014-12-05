/*-------------------------------------------- */
/** Helper to extract real values from         */
/** 2d Transform Matrix */
/*-------------------------------------------- */

module.exports = function(el) {
    var styles = window.getComputedStyle(el, null);

    if (!el || !styles) return;

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
        rotate: parseInt(rotation),
        scale: scale,
        translateX: parseInt(xTranslate),
        translateY: parseInt(yTranslate)
    };
};