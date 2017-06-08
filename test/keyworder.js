/*
 * @author David Menger
 */
'use strict';

const assert = require('assert');
const sinon = require('sinon');
const Keyworder = require('../src/Keyworder');

const MOCK_RESULT = [{ label: 'tag', value: 0.99 }];
const EXPECTED_RESULT = { tag: 'tag', score: 0.99 };

class Classifier {
    constructor (path) { this.path = path; }
    predict (text, n, cb) { setTimeout(() => cb(null, MOCK_RESULT)); }
}

describe('<Keyworder>', function () {

    describe('#setResolver()', function () {

        it('throws error, when model is missing', function () {
            const k = new Keyworder();

            assert.throws(() => {
                k.setResolver({});
            });
        });

    });

    describe('#resolve()', function () {

        it('should return matched data', function () {
            const k = new Keyworder();
            const logger = sinon.spy();
            const filter = sinon.spy();

            k.setResolver({
                model: 'fakePath',
                logger,
                filter,
                classifierClass: Classifier
            });

            return Promise.all([
                k.resolve('first'),
                k.resolve('first'),
                k.resolve('second')
            ]).then(([first, firstAgain, second]) => {
                assert.deepStrictEqual(first, EXPECTED_RESULT);
                assert.deepStrictEqual(firstAgain, EXPECTED_RESULT);
                assert.deepStrictEqual(second, EXPECTED_RESULT);

                assert(filter.calledTwice);
                assert(logger.calledTwice);

                return k.resolve('second');
            }).then(() => {
                assert(filter.calledTwice);
                assert(logger.calledTwice);
            });
        });

        it('throws error, when resolver is missing', function () {
            assert.throws(() => {
                const k = new Keyworder();
                k.resolve('t', null, 'nonexisting');
            });
        });

    });

    describe('#middleware()', function () {

        it('should return resolving middleware', function () {
            const k = new Keyworder();
            const logger = sinon.spy();
            const filter = sinon.spy();

            k.setResolver({
                model: 'fakePath',
                logger,
                filter,
                classifierClass: Classifier
            });

            const good = k.middleware('tag');
            const bad = k.middleware('notag');

            const fakeReq = { text: () => 'xyz' };

            return Promise.all([
                good(fakeReq),
                bad(fakeReq)
            ]).then(([first, second]) => {
                assert.strictEqual(first, true);
                assert.strictEqual(second, false);

                assert(filter.calledOnce);
                assert(logger.calledOnce);

                assert.equal(filter.firstCall.args[0], 'xyz');
            });
        });

        it('does not match, when there is no text', function () {
            const k = new Keyworder();
            const m = k.middleware('tag');

            return m({ text: () => null })
                .then((res) => {
                    assert.strictEqual(res, false);
                });
        });

    });

});
