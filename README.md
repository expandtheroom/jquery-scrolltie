# ScrollTie #

###a jQuery plugin that ties a CSS property to scroll###

[![Build Status](https://travis-ci.org/expandtheroom/jquery-scrolltie.svg)](https://travis-ci.org/expandtheroom/jquery-scrolltie)

*Supports modern browsers and IE9+ (could be modified to support IE8 but need seems too small)*

This plugin is useful for creating parallax motion or similar effects in which a CSS property needs to be incremented on user scroll.  Here are a handful sites currently using ScrollTie (some are using previous (unreleased) versions):

* [Travel + Leisure Epic Journeys](http://www.travelandleisure.com/promo/epic-journeys)
* [Initiative.com](http://initiative.com/) - homepage
* [Dr. Cool Recovery](http://www.drcoolrecovery.com) - homepage
* [D3 Libraries](http://teacher.scholastic.com/products/classroombooks/d3libraries/index.htm)

If you're using ScrollTie on a project, please email megan@expandtheroom.com when it's live so that we can include it here (with permission)!

## Get ScrollTie ##

####Via npm:####
```
npm install jquery-scrolltie
```
####Via bower: ####

```
bower install jquery-scrolltie
```
####DIY####
Download or clone repo and include js/dist/scrollTie.min.js (unminified version available as well)

**ScrollTie depends on jQuery** - be sure to include a stable version before the plugin script.  Tested with latest stable version 1 and 2.

## Usage ##

Call scrollTie on any valid jQuery object and pass it options.  The only required option is property, which can point to any increment-able CSS property.  There are supported shorthands for 2D transforms, backgroundPositionX, and backgroundPositionY.

Example:

```
$('.scroll-tied-element').scrollTie({
    property: 'translateX'
})

```


## Options ##

### property ###
_string_ (required) CSS property or one of the following supported shorthands:

* 'translateX'
* 'translateY'
* 'scale'
* 'rotate'
* 'backgroundPositionX'
* 'backgroundPositionY'
* 'opacity'

### speed ###
_number_ (default: 1) Relative to speed of scroll, where 1 moves *at* speed of scroll, and 2 moves twice as fast as speed of scroll

### stopAtValue ###
_number_ or _function_ When the property is incremented to this value, stop moving element. Function option must return a number.

### reverseDirection ###
_boolean_ (default: false) Decrease property value on scroll.

### delay ###
_number_ or _function_ Distance past the bottom of the viewport to wait before beginning to increment property. Functions are passed a reference to the dom element and must return a number.

Example:

```
function(el) {
    return $(el).height() * 2;
}

```

### propertyValueFormat ###
_function_ Provide your own formatting for special properties that are don't have built-in support, such as 3D transforms, or override the format for custom behavior.  This function is called on update and should be used with care. This function must return a string which will be used as the value of the specified property. The example below is the built-in propertyValueFormat for transform: translateX().

```
function(moveValue, element) {
    return 'translateX(' + moveValue + 'px)';
}

```

### context ###
_selector_ (default: window) Specify a scrolling context

### manualInit ###
_boolean_ (default:false) Wait for manual call to initialize scrollTie
  

## Callbacks ##

All callback functions are passed the dom element as an argument.

Format:

```

function(element) {
    // your callback
}

```


### afterStop ###
_function_ Called every time element reaches its stopAtValue

### onPause ###
_function_ Called when element is manually paused

### onStart ###
_function_ Called when element is restarted after it has been paused

### onDestroy ###
_function_ Called when scrollTie instance is destroyed


### Public Methods ###

```

// To affect single instance:
$('.scroll-tied-element').scrollTie('method');

// To affect all instances:
$.scrollTie('method');

```

### init ###
Call once if option manualInit is set to true to begin incrementing property value on scroll.

### pause ###
Call pause to temporarily stop incrementing property value. You must call $('.scroll-tied-element').scrollTie('restart') to continue incrementing.

### restart ###
Call restart after pause to begin incrementing again.

** NOTE: Pause and Restart will take elements out of the flow so that they will not necessarily end back where they began.  Use with care! **

### destroy ###
Destroys and removes all plugin data.

### refresh ###
Recalculate offsets, delays, and element positions - useful for when the dom changes asynchronously.  This is called internally on window resize.


## Testing ##

To test, you will need to run npm install to get test library packages.  Current test suite is located in the tests directory.

Open the `tests/index.html` file in your web browser to run the tests.

## Contribution guidelines ##

Log an issue, fork the repo, and create a pull request.  Include Issue # and change details in the commit.


## Changelog ##

### v1.0.0 ###

* Initial release.

### v1.0.1 ###

* Allow function to be passed in for stopAtValue option


### v1.0.2 ###

* Fix UMD by adding jquery as a dependency in all environments.


### v1.0.3 ###

* Wait until first animate request to calculate static transform value
