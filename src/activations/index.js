/*
 * @author David Menger
 */
'use strict';

const Tanh = require('./Tanh');
const Linear = require('./Linear');
const Sigmoid = require('./Sigmoid');
const Relu = require('./Relu');

module.exports = {
    TANH: Tanh,
    LINEAR: Linear,
    SIGMOID: Sigmoid,
    RELU: Relu
};
