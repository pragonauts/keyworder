/*
 * @author David Menger
 */
'use strict';

class L1 {

    /**
     *
     * @static
     * @param {number} w
     * @returns {number} x
     */
    static output (w) {
        return Math.abs(w);
    }

    /**
     * (description)
     *
     * @static
     * @param {number} w
     * @returns {number} w
     */
    static der (w) {
        return w < 0 ? -1 : 1;
    }
}

module.exports = L1;
