/*
 * @author David Menger
 */
'use strict';

const Node = require('./Node');
const Link = require('./Link');
const activations = require('./activations');

class Network {

    constructor (networkShape,
        activation = activations.TANH,
        outputActivation = activations.TANH,
        regularization = null,
        inputIds = [],
        defaultLinkWeight = null) {

        /**
         * @type {Array.<Array.<Node>>}
         */
        this.network = [];

        let id = 1;

        for (let layerIdx = 0; layerIdx < networkShape.length; layerIdx++) {
            const isOutputLayer = layerIdx === networkShape.length - 1;
            const isInputLayer = layerIdx === 0;
            const currentLayer = [];

            this.network.push(currentLayer);

            const numNodes = networkShape[layerIdx];

            for (let i = 0; i < numNodes; i++) {
                const nodeId = isInputLayer && inputIds.length > i
                    ? inputIds[i]
                    : (++id).toString();

                const node = new Node(nodeId, isOutputLayer ? outputActivation : activation);
                currentLayer.push(node);

                if (layerIdx === 0) {
                    continue;
                }

                // Add links from nodes in the previous layer to this node.
                for (let j = 0; j < this.network[layerIdx - 1].length; j++) {
                    const prevNode = this.network[layerIdx - 1][j];
                    const link = new Link(prevNode, node, regularization, defaultLinkWeight);

                    prevNode.outputs.push(link);
                    node.inputLinks.push(link);
                }
            }
        }
    }

    /**
     * Runs a forward propagation of the provided input through the provided
     * network. This method modifies the internal state of the network - the
     * total input and output of each node in the network.
     *
     * @param {Array.<Number>} inputs The input array. Its length should match the number of input
     *     nodes in the network.
     * @return The final output of the network.
     */
    forwardProp (inputs) {
        const inputLayer = this.network[0];

        if (inputLayer.length !== inputs.length) {
            throw new Error('The number of inputs must match the number of input nodes');
        }

        // Update the input layer.
        for (let i = 0; i < inputLayer.length; i++) {
            inputLayer[i].output = inputs[i];
        }

        for (let layerIdx = 1; layerIdx < this.network.length; layerIdx++) {
            const currentLayer = this.network[layerIdx];

            // Update all the nodes in this layer.
            for (let i = 0; i < currentLayer.length; i++) {
                const node = currentLayer[i];
                node.updateOutput();
            }
        }

        return this.network[this.network.length - 1]
            .map((node) => node.output);
    }

    /**
     * Runs a backward propagation using the provided target and the
     * computed output of the previous call to forward propagation.
     * This method modifies the internal state of the network - the error
     * derivatives with respect to each node, and each weight
     * in the network.
     */
    backProp (targets, errorFunc = Network.errorFunctionDer) {

        /**
         * The output node is a special case. We use the user-defined error
         * function for the derivative.
         */
        const outputLayer = this.network[this.network.length - 1];

        if (outputLayer.length !== targets.length) {
            throw new Error('The number of inputs must match the number of input nodes');
        }

        // Update the input layer.
        for (let i = 0; i < outputLayer.length; i++) {
            outputLayer[i].outputDer = errorFunc(outputLayer[i].output, targets[i]);
        }

        for (let layerIdx = this.network.length - 1; layerIdx >= 1; layerIdx--) {
            const currentLayer = this.network[layerIdx];

            /**
             * Compute the error derivative of each node with respect to:
             * 1) its total input
             * 2) each of its input weights.
             */
            for (let i = 0; i < currentLayer.length; i++) {
                const node = currentLayer[i];
                node.updateInputDerivation();
            }

            if (layerIdx === 1) {
                continue;
            }

            const previousLayer = this.network[layerIdx - 1];

            for (let i = 0; i < previousLayer.length; i++) {
                const node = previousLayer[i];
                // Compute the error derivative with respect to each node's output.
                node.updateOutputDerivation();
            }
        }
    }

    updateWeights (learningRate, regularizationRate = 0) {
        for (let layerIdx = 1; layerIdx < this.network.length; layerIdx++) {
            const currentLayer = this.network[layerIdx];
            for (let i = 0; i < currentLayer.length; i++) {
                currentLayer[i].updateBias(learningRate, regularizationRate);
            }
        }
    }

    static errorFunction (output, target) {
        if (output instanceof Array) {
            const errSum = output
                .reduce((sum, value, i) => sum + Network.errorFunction(value, target[i]), 0);

            return errSum / output.length;
        }

        return 0.5 * Math.pow(output - target, 2);
    }

    static errorFunctionDer (output, target) {
        return output - target;
    }
}

module.exports = Network;
