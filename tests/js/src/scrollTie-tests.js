var $doc = $(document),
    parse2dTransformMatrix = require('../../../src/helpers/parse2dTransformMatrix');

/*-------------------------------------------- */
/** Set up little debounce to                  */
/** listen for scrollend
/*-------------------------------------------- */

var timeoutDelay = 40,
    scrollTicker = 0;

function detectScrollStop(ticker) {

    // debounce until scroll is over
    setTimeout(function(){
        if (ticker == scrollTicker) {
            $(document).trigger('scrollend');
        }
    }, timeoutDelay);
}

$(window).on('scroll', function() {
    scrollTicker++;
    detectScrollStop(scrollTicker);
});

/*-------------------------------------------- */
/** Actual Test */
/*-------------------------------------------- */

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

                $doc.one('scrollend', function() {
                    expect(parse2dTransformMatrix(element).translateX).to.equal(500);
                    done();
                    window.scrollTo(0, 0);
                });

                window.scrollTo(0, 500);
            })

            it('should handle a backgroundPosition axis', function(done) {
                $(element).scrollTie({ property: 'backgroundPositionX', speed: 1 });

                $doc.one('scrollend', function() {
                    expect(getComputedStyle(element).backgroundPosition.split(' ')[0]).to.equal('500px');
                    done();
                    window.scrollTo(0, 0);
                });

                window.scrollTo(0, 500);
            })

        })

        describe('stopAtValue option', function() {

            it('should increment property to stopAtValue', function(done) {
                $(element).scrollTie({ property: 'top', stopAtValue: 500 });

                $doc.one('scrollend', function() {
                    expect(element.style.top).to.equal('500px');
                    done();
                });

                window.scrollTo(0, 500);
            })

            it('should not increment property higher than stopAtValue', function(done) {
                $(element).scrollTie({ property: 'top', stopAtValue: 500 });

                $doc.one('scrollend', function() {
                    expect(element.style.top).to.equal('500px');
                    done();
                    window.scrollTo(0, 0);
                });

                window.scrollTo(0, 501);
            })

        })

        describe('reverseDirection option', function() {

            it('should decrement position', function(done) {
                $(element).css({top: '500px'});
                $(element).scrollTie({ property: 'top', reverseDirection: true });

                $doc.one('scrollend', function() {
                    expect(element.style.top).to.equal('0px');
                    done();
                    window.scrollTo(0, 0);
                });

                window.scrollTo(0, 500);
            })

        })

        describe('delay option', function() {

            it('should not increment property when scroll is less than delay (px value)', function(done) {
                $(element).scrollTie({ property: 'top', delay: 500 });

                $doc.one('scrollend', function() {
                    expect(element.style.top).to.equal('0px');
                    done();
                    window.scrollTo(0, 0);
                });

                window.scrollTo(0, 500);
            })

            it('should not increment property when scroll is less than delay (function return value)', function(done) {
                $(element).scrollTie({ property: 'top', delay: function(el) {
                    return 500;
                } });

                $doc.one('scrollend', function() {
                    expect(element.style.top).to.equal('0px');
                    done();
                    window.scrollTo(0, 0);
                });

                window.scrollTo(0, 500);
            })

            it('should begin incrementing property when scroll position is greater than delay', function(done) {
                $(element).scrollTie({ property: 'top', delay: 500});
                $(element).css({position: 'absolute'});

                $doc.one('scrollend', function() {
                    expect(element.style.top).to.equal('1px');
                    done();
                    window.scrollTo(0, 0);
                });

                window.scrollTo(0, 501);
            })

        })

        describe('speed option', function() {

            it('should increment position at correct speed', function(done) {
                $(element).scrollTie({ property: 'top', speed: 2 });
                $(element).css({position: 'absolute'});

                $doc.one('scrollend', function() {
                    expect(element.style.top).to.equal('1000px');
                    done();
                    window.scrollTo(0, 0);
                });

                window.scrollTo(0, 500);
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

                    $doc.one('scrollend', function() {
                        expect(element.style.left).to.equal('229px');
                        done();
                    });

                    window.scrollTo(0, 199);
                })

                it('should return to original value when element is no longer in view, with buffer of 100px', function(done) {
                    $(element).scrollTie({ property: 'left' });

                    $doc.one('scrollend', function() {
                        expect(element.style.left).to.equal('30px');
                        done();
                        window.scrollTo(0, 0);
                    });

                    window.scrollTo(0, 300);
                })

            })

            describe('true', function() {

                beforeEach(function(done) {
                    $(element).css({ position: 'absolute', left: '30px', height: '100px', width: '100px'});
                    done();
                })

                it('should continue incrementing value when element is no longer in view', function(done) {
                    $(element).scrollTie({ property: 'left', animateWhenOutOfView: true });

                    $doc.one('scrollend', function() {
                        expect(element.style.left).to.equal('330px');
                        done();
                        window.scrollTo(0, 0);
                    });

                    window.scrollTo(0, 300);
                })

            })

        })

        describe('onStart callback option', function() {
            var onStart = sinon.spy();

            it('should call onStart once after first animation frame', function(done) {
                $(element).scrollTie({ property: 'top', onStart: onStart });

                $doc.one('scrollend', function() {
                    expect(onStart.calledOnce).to.be.true();
                    done();
                });

                window.scrollTo(0, 500);
            })

            it('should not call onStart on subsequent scrolls', function(done) {

                $doc.one('scrollend', function() {
                    expect(onStart.callCount).to.equal(1);
                    done();
                    window.scrollTo(0, 0);
                });

                window.scrollTo(0, 501);
            })

        })

        describe('afterStop callback option', function() {
            var afterStop = sinon.spy();

            describe('should call afterStop each time stopAtValue is reached', function() {

                it('calls afterStop when stopAtValue is reached', function(done) {
                    $(element).scrollTie({ property: 'top', afterStop: afterStop, stopAtValue: 500 });

                    $doc.one('scrollend', function() {
                        expect(afterStop.callCount).to.equal(1);
                        done();
                        window.scrollTo(0, 0);
                    });

                    window.scrollTo(0, 500);
                })

                it('calls afterStop if stopAtValue is reached again', function(done) {

                    $doc.one('scrollend', function() {
                        expect(afterStop.callCount).to.equal(2);
                        done();
                        window.scrollTo(0, 0);
                    });
                    
                    window.scrollTo(0, 500);
                })
            })

        })

        describe('onPause callback option', function() {
            var onPause = sinon.spy();

            describe('should call onPause when scrollTied element is manually paused', function() {

                it('calls onPause when pause() is called on scrollTied element', function(done) {
                    $(element).scrollTie({ property: 'top', onPause: onPause });

                    $(element).scrollTie('pause');

                    $doc.one('scrollend', function() {
                        expect(onPause.callCount).to.equal(1);
                        done();
                    });
                })
            })

        })

        describe('onDestroy callback option', function() {
            var onDestroy = sinon.spy();

            describe('should call onDestroy when scrollTied element is manually destroyed', function() {

                it('calls onDestroy when destroy() is called on scrollTied element', function() {
                    $(element).scrollTie({ property: 'top', onDestroy: onDestroy });

                    $(element).scrollTie('destroy');

                    expect(onDestroy.callCount).to.equal(1);
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

            $doc.one('scrollend', function() {
                expect($el.css('top')).to.equal('0px');
                done();
            });

            window.scrollTo(0, 500);
        })

        it('should start updating property on scroll starting from last pause value', function(done) {
            $el.scrollTie('restart');

            $doc.one('scrollend', function() {
                expect($el.css('top')).to.equal('100px');
                done();
                window.scrollTo(0, 0);
            });

            window.scrollTo(0, 600);
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

            $doc.one('scrollend', function() {
                expect($el[0].style.top).to.be.empty();
                done();
            });

            window.scrollTo(0, 300);
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
