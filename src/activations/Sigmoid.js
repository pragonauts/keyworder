/*
 * @author David Menger
 */
'use strict';

class Sigmoid {

    /**
     *
     * @static
     * @param {number} x
     * @returns {number} x
     */
    static output (x) {
        return 1 / (1 + Math.exp(-x));
    }

    /**
     * (description)
     *
     * @static
     * @param {number} x
     * @returns {number} x
     */
    static der (x) {
        const output = Sigmoid.output(x);
        return output * (1 - output);
    }
}

module.exports = Sigmoid;
