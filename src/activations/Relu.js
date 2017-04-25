/*
 * @author David Menger
 */
'use strict';

class Relu {

    /**
     *
     * @static
     * @param {number} x
     * @returns {number} x
     */
    static output (x) {
        return Math.max(0, x);
    }

    /**
     * (description)
     *
     * @static
     * @param {number} x
     * @returns {number} x
     */
    static der (x) {
        return x < 0 ? 0 : 1;
    }
}

module.exports = Relu;
