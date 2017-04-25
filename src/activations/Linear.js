/*
 * @author David Menger
 */
'use strict';

class Linear {

    /**
     *
     * @static
     * @param {number} x
     * @returns {number} x
     */
    static output (x) {
        return x;
    }

    /**
     * (description)
     *
     * @static
     * @returns {number} x
     */
    static der () {
        return 1;
    }
}

module.exports = Linear;
