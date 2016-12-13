"use strict";
var assert = require('assert');
let expect = require('chai').expect;
var sinon = require('sinon');

describe('sinon', ()=> {
  describe('examples', ()=> {

    function once(fn) {
        var returnValue, called = false;
        return function () {
            if (!called) {
                called = true;
                returnValue = fn.apply(this, arguments);
            }
            return returnValue;
        };
    }
    
    it("calls the original function", function () {
        var callback = sinon.spy();
        var proxy = once(callback);

        proxy();

        assert(callback.called);
    });
    it("calls the original function only once", function () {
        var callback = sinon.spy();
        var proxy = once(callback);

        proxy();
        proxy();

        assert(callback.calledOnce);
        // ...or:
        // assert.equals(callback.callCount, 1);
    });
    it("calls original function with right this and args", function () {
        var callback = sinon.spy();
        var proxy = once(callback);
        var obj = {};

        proxy.call(obj, 1, 2, 3);

        assert(callback.calledOn(obj));
        assert(callback.calledWith(1, 2, 3));
    });
    it("returns the return value from the original function", function () {
        var callback = sinon.stub().returns(42);
        var proxy = once(callback);

        expect(proxy()).to.equal(42);
    });

  });
});