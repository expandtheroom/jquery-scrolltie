var timeoutDelay = 30;

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
        $(element).css({position: 'absolute', top: '0px', position: 'fixed'});
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

            before(function(done) {
                $(element).css({ position: 'absolute', top: '100px'});
                done();
            })

            describe('default: false', function() {

                it('should increment value from natural delay/offset', function(done) {
                    done();
                })

                it('should stop incrementing value when element is no longer in view', function(done) {
                    done();
                })
            
            })

            describe('true', function() {

                it('should not begin incrementing value until element is in view (default offset)', function(done) {
                    done();
                })

                it('should increment value from natural delay/offset', function(done) {
                    done();
                })

                it('should continue incrementing value when element is no longer in view', function(done) {
                    done();
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
    // 2. animateWhenOutOfView

});
