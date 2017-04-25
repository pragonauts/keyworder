# Keyworder

Machine learning tool for word processing.

## Usage

```javascript
const keyworder = require('keyworder');

const input = 'Ano';
keyworder.matches('ano', input);
```

## Neural networks

Usage

```javascript
const {
    Network,
    Runner,
    activations
} = require('keyworder');

const network = new Network([4, 3, 2], activations.SIGMOID, activations.SIGMOID);
const runner = new Runner(network);
runner.limit = 50000;

const set = [
    { input: [12, 16, 12, 16], output: [1, 0] },
    { input: [10, 20, 10, 20], output: [1, 0] },
    // and many more

    { input: [0, 1, 0, 1], output: [0, 1] },
    { input: [1, 0, 1, 0], output: [0, 1] },
    // and many more
];

const successRate = runner.learn(set, 0.03);

assert.ok(successRate < 0.0001, 1);

assert.deepEqual(runner.output([11, 11, 11, 11]), [0, 1]);
```

## Vision

Handle process of machine learning, groupping and maintaining keyword database for word processing.

- language processing using neural networks
- process of building large databases