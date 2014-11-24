describe('ScrollTie', function() {

    describe('Test Test!', function() {
        it('should be equal to 3', function() {
            assert.equal(3, 1 + 2);
        })
    })

    describe('$(element).scrollTie()', function() {
        it('should return a jQuery error', function() {
            expect($(document.createElement('div')).scrollTie()).toThrow($.error);
        })
    })

})
