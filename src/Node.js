/*
 * @author David Menger
 */
'use strict';

class Node {

    /**
     * Creates an instance of Node.
     *
     * @param {string} id (description)
     * @param {ActivationFunction} activation (description)
     */
    constructor (id, activation) {

        /**
         * @type {string}
         */
        this.id = id;

        /**
         * @type {ActivationFunction}
         */
        this.activation = activation;

        this.inputLinks = [];

        this.outputs = [];

        this.bias = 0.1;

        this._totalInput = null;

        this.output = null;

        this._outputDer = 0;

        this._inputDer = 0;

        this._accInputDer = 0;

        this._numAccumulatedDers = 0;
    }

    updateOutput () {
        this._totalInput = this.inputLinks
            .reduce((previous, link) => previous + (link.weight * link.source.output), this.bias);
        this.output = this.activation.output(this._totalInput);
        return this.output;
    }

    updateInputDerivation () {
        this._inputDer = this._outputDer * this.activation.der(this._totalInput);
        this._accInputDer += this._inputDer;
        this._numAccumulatedDers++;

        for (let j = 0; j < this.inputLinks.length; j++) {
            const link = this.inputLinks[j];
            link.backPropagateDerivation(this._inputDer);
        }
    }

    updateOutputDerivation () {
        this._outputDer = this.outputs
            .reduce((sum, link) => sum + link.weightedDestDerivation, 0);
    }

    updateBias (learningRate, regularizationRate = 0) {
        if (this._numAccumulatedDers > 0) {
            this.bias -= learningRate * this._accInputDer / this._numAccumulatedDers;
            this._accInputDer = 0;
            this._numAccumulatedDers = 0;
        }

        for (let i = 0; i < this.inputLinks.length; i++) {
            this.inputLinks[i].updateWeight(learningRate, regularizationRate);
        }
    }

    get inputDer () {
        return this._inputDer;
    }

    set outputDer (outputDer) {
        this._outputDer = outputDer;
    }

}

module.exports = Node;
