# ScrollTie #

a jQuery plugin that ties a CSS property to user scroll

* Currently working on v1.0
* Supports modern browsers and IE9+ (could be modified to support IE8 but need seems too small)

### Get ScrollTie ###

* Download or clone repo and include js/dist/scrollTie.min.js (unminified version available as well)
* Depends on jQuery - tested with latest stable version 1 and 2

### Usage ###

Call scrollTie on any valid jQuery object and pass it options.  The only required option is property, which can point to any incrementable CSS property.  There are supported shorthands for 2D transforms and backgroundPositionX and Y.

Example:
```
#!javaScript

$('.scroll-tied-element').scrollTie({
    property: 'translateX'
})

```

## Options ##

```
#!javaScript

{
  // STRING (required)
  // CSS property or one of the following supported shorthands: 
  // * 'translateX'
  // * 'translateY'
  // * 'scale'
  // * 'rotate'
  // * 'backgroundPositionX'
  // * 'backgroundPositionY'
  property: selector,

  // NUMBER
  // relative to speed of scroll, where 1 moves *at* speed of scroll, and 2 moves twice as fast as speed of scroll
  speed: [ number: 1 ],

  // when the property is incremented to this value, stop moving element
  stopAtValue: [ number ],

  reverseDirection: [ boolean: false ],

  // specify how many pixels to delay before beginning to move element.  Can be a number or a function that returns a number
  delay: [ number ] or [ function(element) {} ],

  // provide your own formatting for special properties that are don't have built-in support, such as 3D transforms, or override the format for custom behavior
  // this function is called on update and should be used with care.  The example below is the built-in propertyValueFormat for transform: translateX().
  // This function must return a string which will be used as the value of the specified property.
  propertyValueFormat: function(moveValue, element) {
    return 'translateX(' + moveValue + 'px)';
  },
  
  // specify a different container that must be visible to animate element
  container: [ selector ],

  // specify an event other than scroll to tie property to (experimental - interested in potential use cases)
  evt: [ event: 'scroll' ],

  // specify a scrolling context
  context: [ selector: window ]

  // wait for manual call to initialize scrollTie
  manualInit: [ boolean: false ]
  
  // Callbacks

  // function to call every time element reaches its stopAtValue
  afterStop: function(element) {},

  // function to call when element is manually paused
  onPause: function(element) {},

  // function to call when element is restarted after it has been paused
  onStart: function(element) {},

  // function to call when scrollTie instance is destroyed
  onDestroy: function(element) {},

}
```

### Public Methods ###

```
#!javascript

// To affect single instance:
$('.scrolltie-element').scrollTie('method');

// To affect all instances:
$.scrollTie('method');

```
## Available methods ## 

* pause
* restart (call after pause to restart single instance or all instances)
* destroy
* refresh (recalculate offsets, delays, and element positions - useful for when the dom changes asynchronously.  called internally on window resize)


### Testing ###
* To test, you will need to run npm install to get test library packages.  Current test suite is located in the tests directory.

### Contribution guidelines ###

* Writing tests?

### Who do I talk to? ###

* Megan Tong (essentialred)
* ETR team