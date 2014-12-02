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
        $(element).css({position: 'absolute', top: '0px'});
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

            expect($.scrollTie()).to.have.ownProperty('scrollTied0');
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
            scrollTieId;

        it('should remove instance from allScrollTiedElements', function() {
            $el = $(element);
            $el.scrollTie({ property: 'top' });

            scrollTieId = $el.data().plugin_scrollTie.id;

            $el.scrollTie('destroy');

            expect($.scrollTie()[scrollTieId]).to.be.undefined;
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

    // methods to test
    // 1. ? init - test that a new instance has been added to allScrollTiedElements
    // 2. ? destroy - test that the instance does not exist in allScrollTiedElements. test scroll and make sure property does not update
    // 3. pause - pause and test scroll, make sure prop doesn't update
    // 4. start - test scroll and make sure property has updated
    // 5. refresh - not sure how to test
    // 6. test each option
    //      - respects stopAtValue
    //      - respects reverseDirection
    //      - handles transform properties
    //      - handles background position X and Y properties
    //      - respects delay
    //      - respects speed ?
    //      - provides correct context
    //      - does not initialize if manualInit is set
    //      
    //      - calls onStart
    //      - calls afterStop
    //      - calls onPause
    //      - calls onDestroy
    //      

});
