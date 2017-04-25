/*
 * @author David Menger
 */
'use strict';

function tanh (x) {
    if (typeof Math.tanh === 'function') {
        return Math.tanh(x);
    } else if (x === Infinity) {
        return 1;
    } else if (x === -Infinity) {
        return -1;
    }

    const e2x = Math.exp(2 * x);
    return (e2x - 1) / (e2x + 1);
}

class Tanh {

    /**
     *
     * @static
     * @param {number} x
     * @returns {number} x
     */
    static output (x) {
        return tanh(x);
    }

    /**
     * (description)
     *
     * @static
     * @param {number} x
     * @returns {number} x
     */
    static der (x) {
        const out = Tanh.output(x);
        return 1 - out * out;
    }
}

module.exports = Tanh;
