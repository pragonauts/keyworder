/*
 * @author David Menger
 */
'use strict';

const CachedPrediction = require('./CachedPrediction');

const DEFAULT_NS = 'default';
const DEF_FILTER = w => `${w}`.toLocaleLowerCase();

class Keyworder {

    constructor (logger = () => {}, filter = DEF_FILTER, Prediction = CachedPrediction) {
        this._resolvers = new Map();
        this._defaultConfig = {
            threshold: 0.95,
            cacheSize: 20,
            logger,
            filter
        };
        this._Prediction = Prediction;
    }

    /**
     *
     * @param {Object} configuration
     * @param {string} [namespace]
     */
    setResolver (configuration, namespace = DEFAULT_NS) {
        const cfg = Object.assign({}, this._defaultConfig, configuration);

        if (typeof cfg.model !== 'string') {
            throw new Error('`model` attribute in config should be string');
        }

        const prediction = new this._Prediction(
            cfg.model,
            cfg.filter,
            cfg.logger,
            cfg.cacheSize,
            cfg.classifierClass
        );

        this._resolvers.set(namespace, {
            prediction,
            cfg
        });
    }

    resolve (text, threshold = null, namespace = DEFAULT_NS) {
        const resolver = this._resolvers.get(namespace);

        if (!resolver) {
            throw new Error(`Resolver for namespace: ${namespace} is missing. Call 'keyworder.setResolver(...)' to add it.`);
        }

        const useThreshold = threshold || resolver.cfg.threshold;

        return resolver.prediction.predict(text)
            .then((res) => {
                if (res.length === 0 || res[0].score < useThreshold) {
                    return null;
                }
                return res[0];
            });
    }

    middleware (tag = null, threshold = null, namespace = DEFAULT_NS) {
        return (req) => {
            const text = req.text();
            if (!text) {
                return Promise.resolve(false);
            }

            return this.resolve(text, threshold, namespace)
                .then(res => res && res.tag === tag);
        };
    }

}

module.exports = Keyworder;
