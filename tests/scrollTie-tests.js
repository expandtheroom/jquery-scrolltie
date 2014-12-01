describe('ScrollTie', function() {

    describe('$(element).scrollTie()', function() {
        it('should return a jQuery error', function() {
            var fn = $(document.createElement('div')).scrollTie;
            expect(fn).to.throw($.Error);
        });
    });

    describe('$(element).scrollTie(options)', function() {
        var element;

        beforeEach(function(done) {
            element = document.createElement('div');
            $('body').append(element);
            $(element).css({position: 'absolute', top: '0px'});
            done();
        });

        afterEach(function(done) {
            $(element).remove();
            done();
        });

        describe('it should respect stopAtValue', function() {

            it('should increment property to stopAtValue', function(done) {
                $(element).scrollTie({ property: 'top', stopAtValue: 500 });
                window.scrollTo(0, 500);

                setTimeout(function(){
                    expect(element.style.top).to.equal('500px');
                    done();
                }, 0);

            });

            it('should not increment property higher than stopAtValue', function(done) {
                $(element).scrollTie({ property: 'top', stopAtValue: 500 }); 
                window.scrollTo(0, 501);

                setTimeout(function(){
                    expect(element.style.top).to.equal('500px');
                    done();
                    window.scrollTo(0, 0);
                }, 0);
                
            })

        });

        describe('it should respect reverseDirection', function() {

            it('should decrement position', function(done) {
                $(element).css({top: '500px'});
                $(element).scrollTie({ property: 'top', reverseDirection: true });
                
                window.scrollTo(0, 500);
                
                setTimeout(function(){
                    expect(element.style.top).to.equal('0px');
                    done();
                    window.scrollTo(0, 0);
                }, 10);

            });

        });

        describe('it should respect delay', function() {

            it('should not increment property when scroll is less than delay (px value)', function(done) {
                $(element).scrollTie({ property: 'top', delay: 500 });
                
                window.scrollTo(0, 500);

                setTimeout(function(){
                    expect(element.style.top).to.equal('0px');
                    done();
                    window.scrollTo(0, 0);
                }, 10);

            });

            it('should not increment property when scroll is less than delay (function return value)', function(done) {
                $(element).scrollTie({ property: 'top', delay: function(el) {
                    return 500;
                } });
                
                window.scrollTo(0, 500);
                
                setTimeout(function(){
                    expect(element.style.top).to.equal('0px');
                    done();
                    window.scrollTo(0, 0);
                }, 10);
            });

            it('should begin incrementing property when scroll position is greater than delay', function(done) {
                $(element).scrollTie({ property: 'top', delay: 500});
                $(element).css({position: 'absolute'});
                
                window.scrollTo(0, 501);

                setTimeout(function(){
                    expect(element.style.top).to.equal('1px');
                    done();
                    window.scrollTo(0, 0);
                }, 10);
            });

        });

        describe('it should respect speed', function() {

            it('should increment position at correct speed', function(done) {
                $(element).scrollTie({ property: 'top', speed: 2 });
                $(element).css({position: 'absolute'});
                
                window.scrollTo(0, 500);
                
                setTimeout(function(){
                    expect(element.style.top).to.equal('1000px');
                    done();
                    window.scrollTo(0, 0);
                }, 10);
            });

        });

    });

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
