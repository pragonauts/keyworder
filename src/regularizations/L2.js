/*
 * @author David Menger
 */
'use strict';

class L2 {

    /**
     *
     * @static
     * @param {number} w
     * @returns {number} x
     */
    static output (w) {
        return 0.5 * w * w;
    }

    /**
     * (description)
     *
     * @static
     * @param {number} w
     * @returns {number} w
     */
    static der (w) {
        return w;
    }
}

module.exports = L2;
