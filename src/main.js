/*
 * @author David Menger
 */
'use strict';

const Keyworder = require('./Keyworder');

const kw = new Keyworder();

/**
 * Create resolver middleware for PrgChatbot
 *
 * @param {string} tag - tag for matching
 * @param {number} [threshold] - override success threshold
 * @param {string} [namespace] - resolver namespace
 * @returns {Function}
 *
 * @example
 * const keyworder = require('keyworder');
 *
 * router.use(keyworder('hello-intent'), (req, res) => {
 *     res.text('Welcome too!');
 * });
 */
function keyworder (tag, threshold, namespace) {
    return kw.middleware(tag, threshold, namespace);
}

/**
 * @typedef {Object} Configuration
 * @property {string} model - path to trained fast text model
 * @property {number} threshold - prediction threshold (0.95 recommended)
 * @property {number} cacheSize - keep this amount of results cached
 * @property {Function} filter - text preprocessor
 * @property {Function} logger - resolver logger function
 */

/**
 * @param {Configuration} configuration - the resolver configuration
 * @param {string} [namespace] - set resolver for diferent namespace
 *
 * @example
 * const keyworder = require('keyworder');
 * const path = require('path');
 *
 * keyworder.setResolver({
 *     model: path.join(__dirname, 'model.bin')
 * });
 */
function setResolver (configuration, namespace) {
    keyworder.setResolver(configuration, namespace);
}

keyworder.setResolver = setResolver;

/**
 * Resolve single text
 *
 * @param {string} text - query text
 * @param {number} [threshold] - override the threshold
 * @param {string} [namespace] - use other than default resolver
 * @returns {Promise.<{tag:string,score:number}>}
 */
function resolve (text, threshold, namespace) {
    return keyworder.resolve(text, threshold, namespace);
}

keyworder.resolve = resolve;

module.exports = keyworder;
