(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
var timeoutDelay = 30,
    parse2dTransformMatrix = require('../../../js/src/helpers/parse2dTransformMatrix');

describe('ScrollTie', function() {
    var element;

    before(function() {
        $('body').css('height', 4000);
    })

    after(function() {
        $('body').css('height', 'auto');
    })

    beforeEach(function(done) {
        element = document.createElement('div');
        $('body').append(element);
        $(element).css({position: 'fixed', top: '0px'});
        done();
    })

    afterEach(function(done) {
        $(element).remove();
        done();
    })

    describe('$(element).scrollTie()', function() {
        it('should return a jQuery error', function() {
            var fn = $(document.createElement('div')).scrollTie;
            expect(fn).to.throw($.Error);
        })
    })

    describe('$(element).scrollTie(options)', function() {

        it('should add scrollTie instance to allScrollTiedElements', function() {
            $(element).scrollTie({ property: 'top' });
            expect($.scrollTie().indexOf($.data(element, 'plugin_scrollTie'))).to.not.equal(-1);
        })

        describe('property (special cases)', function() {

            it('should handle a transform shorthand', function(done) {
                $(element).scrollTie({ property: 'translateX' });

                window.scrollTo(0, 500);

                setTimeout(function(){
                    expect(parse2dTransformMatrix(element).translateX).to.equal(500);
                    done();
                }, timeoutDelay);
            })

            it('should handle a backgroundPosition axis', function(done) {
                $(element).scrollTie({ property: 'backgroundPositionX', speed: 1 });

                window.scrollTo(0, 500);

                setTimeout(function(){
                    expect(getComputedStyle(element).backgroundPosition.split(' ')[0]).to.equal('500px');
                    done();
                }, timeoutDelay);
            })

        })

        describe('stopAtValue option', function() {

            it('should increment property to stopAtValue', function(done) {
                $(element).scrollTie({ property: 'top', stopAtValue: 500 });
                window.scrollTo(0, 500);

                setTimeout(function(){
                    expect(element.style.top).to.equal('500px');
                    done();
                }, timeoutDelay);

            })

            it('should not increment property higher than stopAtValue', function(done) {
                $(element).scrollTie({ property: 'top', stopAtValue: 500 }); 
                window.scrollTo(0, 501);

                setTimeout(function(){
                    expect(element.style.top).to.equal('500px');
                    done();
                    window.scrollTo(0, 0);
                }, timeoutDelay);

            })

        })

        describe('reverseDirection option', function() {

            it('should decrement position', function(done) {
                $(element).css({top: '500px'});
                $(element).scrollTie({ property: 'top', reverseDirection: true });
                
                window.scrollTo(0, 500);
                
                setTimeout(function(){
                    expect(element.style.top).to.equal('0px');
                    done();
                    window.scrollTo(0, 0);
                }, timeoutDelay);

            })

        })

        describe('delay option', function() {

            it('should not increment property when scroll is less than delay (px value)', function(done) {
                $(element).scrollTie({ property: 'top', delay: 500 });
                
                window.scrollTo(0, 500);

                setTimeout(function(){
                    expect(element.style.top).to.equal('0px');
                    done();
                    window.scrollTo(0, 0);
                }, timeoutDelay);

            })

            it('should not increment property when scroll is less than delay (function return value)', function(done) {
                $(element).scrollTie({ property: 'top', delay: function(el) {
                    return 500;
                } });
                
                window.scrollTo(0, 500);
                
                setTimeout(function(){
                    expect(element.style.top).to.equal('0px');
                    done();
                    window.scrollTo(0, 0);
                }, timeoutDelay);
            })

            it('should begin incrementing property when scroll position is greater than delay', function(done) {
                $(element).scrollTie({ property: 'top', delay: 500});
                $(element).css({position: 'absolute'});
                
                window.scrollTo(0, 501);

                setTimeout(function(){
                    expect(element.style.top).to.equal('1px');
                    done();
                    window.scrollTo(0, 0);
                }, timeoutDelay);
            })

        })

        describe('speed option', function() {

            it('should increment position at correct speed', function(done) {
                $(element).scrollTie({ property: 'top', speed: 2 });
                $(element).css({position: 'absolute'});
                
                window.scrollTo(0, 500);
                
                setTimeout(function(){
                    expect(element.style.top).to.equal('1000px');
                    done();
                    window.scrollTo(0, 0);
                }, timeoutDelay);
            })

        })

        describe('animateWhenOutOfView option', function() {

            beforeEach(function(done) {
                $(element).css({ position: 'absolute', left: '30px', height: '100px', width: '100px'});
                done();
            })

            describe('default: false', function() {

                it('should increment value while element is in view', function(done) {
                    $(element).scrollTie({ property: 'left' });
                    
                    window.scrollTo(0, 199);
                    
                    setTimeout(function(){
                        expect(element.style.left).to.equal('229px');
                        done();
                    }, timeoutDelay);
                })

                it('should return to original value when element is no longer in view, with buffer of 100px', function(done) {                    
                    $(element).scrollTie({ property: 'left' });

                    window.scrollTo(0, 300);
                    
                    setTimeout(function(){
                        expect(element.style.left).to.equal('30px');
                        done();
                        window.scrollTo(0, 0);
                    }, timeoutDelay);
                })
            
            })

            describe('true', function() {

                beforeEach(function(done) {
                    $(element).css({ position: 'absolute', left: '30px', height: '100px', width: '100px'});
                    done();
                })

                it('should continue incrementing value when element is no longer in view', function(done) {
                    $(element).scrollTie({ property: 'left', animateWhenOutOfView: true });

                    window.scrollTo(0, 300);
                    
                    setTimeout(function(){
                        expect(element.style.left).to.equal('330px');
                        done();
                        window.scrollTo(0, 0);
                    }, timeoutDelay);
                })
            
            })

        })

        describe('onStart callback option', function() {
            var onStart = sinon.spy();

            it('should call onStart once after first animation frame', function(done) {
                $(element).scrollTie({ property: 'top', onStart: onStart });

                window.scrollTo(0, 500);

                setTimeout(function() {
                    expect(onStart.calledOnce).to.be.true();
                    done();
                }, timeoutDelay);
            })

            it('should not call onStart on subsequent scrolls', function(done) {
                window.scrollTo(0, 501);

                setTimeout(function() {
                    expect(onStart.callCount).to.equal(1);
                    done();
                    window.scrollTo(0, 0);
                }, timeoutDelay);
            })

        })

        describe('afterStop callback option', function() {
            var afterStop = sinon.spy();

            describe('should call afterStop each time stopAtValue is reached', function() {

                it('calls afterStop when stopAtValue is reached', function(done) {
                    $(element).scrollTie({ property: 'top', afterStop: afterStop, stopAtValue: 500 });

                    window.scrollTo(0, 500);

                    setTimeout(function() {
                        expect(afterStop.callCount).to.equal(1);
                        done();
                        window.scrollTo(0, 0);
                    }, timeoutDelay);
                })

                it('calls afterStop if stopAtValue is reached again', function(done) {
                    window.scrollTo(0, 500);

                    setTimeout(function() {
                        expect(afterStop.callCount).to.equal(2);
                        done();
                        window.scrollTo(0, 0);
                    }, timeoutDelay);
                })
            })

        })

        describe('onPause callback option', function() {
            var onPause = sinon.spy();

            describe('should call onPause when scrollTied element is manually paused', function() {

                it('calls onPause when pause() is called on scrollTied element', function(done) {
                    $(element).scrollTie({ property: 'top', onPause: onPause });

                    $(element).scrollTie('pause');

                    setTimeout(function() {
                        expect(onPause.callCount).to.equal(1);
                        done();
                    }, timeoutDelay);
                })
            })

        })

        describe('onDestroy callback option', function() {
            var onDestroy = sinon.spy();

            describe('should call onDestroy when scrollTied element is manually destroyed', function() {

                it('calls onDestroy when destroy() is called on scrollTied element', function(done) {
                    $(element).scrollTie({ property: 'top', onDestroy: onDestroy });

                    $(element).scrollTie('destroy');

                    setTimeout(function() {
                        expect(onDestroy.callCount).to.equal(1);
                        done();
                    }, timeoutDelay);
                })
            })

        })

    })

    describe('scrollTie#pause and scrollTie#restart', function() {
        var $el;

        before(function(done) {
            $el = $(element);
            $el.scrollTie({ property: 'top' });
            done();
        })

        it('should stop updating property on scroll while paused', function(done) {
            $el.scrollTie('pause');

            window.scrollTo(0, 500);

            setTimeout(function() {
                expect($el.css('top')).to.equal('0px');
                done();
            }, timeoutDelay);
        })

        it('should start updating property on scroll starting from last pause value', function(done) {
            $el.scrollTie('restart');

            window.scrollTo(0, 600);

            setTimeout(function() {
                expect($el.css('top')).to.equal('100px');
                done();
                window.scrollTo(0, 0);
            }, timeoutDelay);
        })

    })

    describe('scrollTie#destroy', function() {
        var $el,
            scrollTieInstance;

        it('should remove instance from allScrollTiedElements', function() {
            $el = $(element);
            $el.scrollTie({ property: 'top' });

            scrollTieInstance = $el.data().plugin_scrollTie;

            $el.scrollTie('destroy');

            expect($.scrollTie().indexOf(scrollTieInstance)).to.equal(-1);
        })

        it('should no longer update property', function(done) {
            window.scrollTo(0, 300);

            setTimeout(function() {
                expect($el.css('top')).to.be.empty();
                done();
            }, timeoutDelay);
        })

        it('should remove plugin data from jQuery object', function() {
            expect($el.data().plugin_scrollTie).to.be.undefined;
        })

        it('should not have access to public instance methods', function() {
            var fn = $(element).scrollTie.bind($(this).data().plugin_scrollTie, 'pause');
            expect(fn).to.throw($.Error);
        })
    })

    // methods left to test:
    // 1. refresh
    // 2. Special props: transforms and bgPos

});

},{"../../../js/src/helpers/parse2dTransformMatrix":1}]},{},[2]);
