/*
 * @author David Menger
 */
'use strict';

const { Classifier } = require('fast-text');

const DEF_CACHE_SIZE = 20;
const DEF_FILTER = w => `${w}`.toLocaleLowerCase();

class CachedPrediction {

    /**
     *
     * @param {string} model - model address
     * @param {Function} filter - text filter function
     * @param {Function} logger - request logging function
     * @param {number} cacheSize - maximal cache size
     * @param {*} ClassifierClass - override the classifier
     */
    constructor (
            model,
            filter = DEF_FILTER,
            logger = null,
            cacheSize = DEF_CACHE_SIZE,
            ClassifierClass = Classifier
    ) {
        this._classifier = new ClassifierClass(model);
        this._cacheSize = cacheSize;
        this._filter = filter;
        this._logger = logger;
        this.tags = 2;
        this._cache = [];
    }

    _mapResult (res) {
        return res.map(r => ({
            tag: r.label.replace(/^__label__/, ''),
            score: r.value
        }));
    }

    _classify (text) {
        const normalized = this._filter(text);
        return new Promise((resolve, reject) => {
            this._classifier.predict(normalized, this.tags, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this._mapResult(res));
                }
            });
        });
    }

    _getOrCreateCache (text) {
        const i = this._cache.findIndex(entry => entry.text === text);
        let cache;

        if (i === -1) {
            cache = {
                text,
                result: null,
                pending: null
            };

            if (!this._cache.length >= this._cacheSize) {
                this._cache.shift();
            }
        } else {
            cache = this._cache.splice(i, 1)[0];
        }
        // put in on top
        this._cache.push(cache);

        return cache;
    }

    _log (text, res) {
        if (!this._logger) {
            return;
        }
        let intent = '';
        let score = 0.0;

        if (res.length !== 0) {
            intent = res[0].tag;
            score = res[0].score;
        }

        const log = {
            text,
            intent,
            score,
            entities: []
        };

        this._logger(log);
    }

    predict (text) {
        const cache = this._getOrCreateCache(text);

        if (cache.result !== null) {
            return Promise.resolve(cache.result);
        } else if (cache.pending !== null) {
            return cache.pending;
        }

        cache.pending = this._classify(text)
            .then((res) => {
                cache.result = res;
                this._log(text, res);
                return res;
            })
            .catch((e) => {
                // remove from cache
                const i = this._cache.findIndex(entry => entry.text === text);
                this._cache.splice(i, 1);
                throw e;
            });

        return cache.pending;
    }

}

module.exports = CachedPrediction;
