window.Woods = window.Woods || {};

(function($){
	// utilities
	function translateYValueFormat(el, moveVal) {
		return 'translateY(' + moveVal + 'px)';
	}
	function translateXValueFormat(el, moveVal) {
		return 'translateX(' + moveVal + 'px)';
	}
	function bgPositionFormat(el, moveVal) {
		return '50% ' + moveVal + 'px';
	}

	var backgroundTrees = new Woods.ParallaxElement('#background', {
		property: 'background-position',
		propertyValueFormat: bgPositionFormat,
		originalVal: 0,
		speed: 0.5
	});

	var midgroundTrees = new Woods.ParallaxElement('#midground', {
		property: 'background-position',
		propertyValueFormat: bgPositionFormat,
		originalVal: 0,
		speed: 0.3
	});

	var bird = new Woods.ParallaxElement('.bird', {
		property: 'transform',
		fallbackProperty: 'left',
		propertyValueFormat: translateXValueFormat,
		speed: 1.8,
		animateWhe9OutOfView: true
	});

	var body = new Woods.ParallaxElement('body', {
		property: 'background-position',
		propertyValueFormat: bgPositionFormat,
		speed: 0.8
	});


})(jQuery);