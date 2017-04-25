/*
 * @author David Menger
 */
'use strict';

class Link {

    /**
     * Creates an instance of Link.
     *
     * @param {Node} source
     * @param {Node} dest
     * @param {Regularization} regularization
     * @param {number} defaultWeight overrides weight
     */
    constructor (source, dest, regularization, defaultWeight = null) {

        /**
         * @type {string}
         */
        this.id = `${source.id}:${dest.id}`;

        /**
         * @type {Node}
         */
        this.source = source;

        /**
         * @type {Node}
         */
        this._dest = dest;

        /**
         * @type {Regularization}
         */
        this.regularization = regularization;

        /**
         * @type {number}
         */
        this.weight = defaultWeight === null ? (Math.random() - 0.5) : defaultWeight;

        /**
         * @type {number}
         */
        this.errorDer = 0;

        /**
         * @type {number}
         */
        this.accErrorDers = 0;

        /**
         * @type {number}
         */
        this.numAccumulatedDers = 0;
    }

    backPropagateDerivation (destinationInputDer) {
        this.errorDer = destinationInputDer * this.source.output;
        this.accErrorDers += this.errorDer;
        this.numAccumulatedDers++;
    }

    updateWeight (learningRate, regularizationRate = 0) {
        const regulDer = this.regularization ?
            this.regularization.der(this.weight) : 0;

        if (this.numAccumulatedDers > 0) {
            this.weight -= (learningRate / this.numAccumulatedDers) *
                (this.accErrorDers + regularizationRate * regulDer);

            this.accErrorDers = 0;
            this.numAccumulatedDers = 0;
        }
    }

    get weightedDestDerivation () {
        return this.weight * this._dest.inputDer;
    }

    /**
     * (description)
     *
     * @readonly
     * @type {Node}
     * @return {Node}
     */
    get dest () {
        return this._dest;
    }

}

module.exports = Link;
