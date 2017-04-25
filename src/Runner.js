/*
 * @author David Menger
 */
'use strict';

const Network = require('./Network');

class Runner {

    constructor (network) {
        this.network = network;

        this.limit = 100000;
    }

    learn (trainingSet, learningRate, regularizationRate = 0) {
        let i = 0;
        while (i++ < this.limit) {
            for (const value of trainingSet) {
                this.network.forwardProp(value.input);
                this.network.backProp(value.output);
                this.network.updateWeights(learningRate, regularizationRate);
            }
            i++;
        }
        return this.checkErrorRate(trainingSet);
    }

    output (data) {
        return this.network.forwardProp(data);
    }

    checkErrorRate (trainingSet) {
        let output;
        let totalErrors = 0;
        let iterations = 0;

        for (const value of trainingSet) {
            output = this.network.forwardProp(value.input);
            totalErrors += Network.errorFunction(output, value.output);
            iterations++;
        }

        return totalErrors / iterations;
    }

}

module.exports = Runner;
