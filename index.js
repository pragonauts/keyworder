
const {
    Network,
    activations,
    regularizations,
    Runner
} = require('./src');

const dict = {
    ano: /ano|yes|jasne/i,
    ne: /ne|no|nein/i,
    fucks: /(^|-)(doprdel|prdel|pic[oua]|mrdk|srac|curak|buzn[oay]|buzerant|kund[aoy]|zmrd|keten|hovn[ao]|blbost|blbc[ei]|blbec|kreten|hovad|kokot|debil|kurv[ay])/,
    end: /(^|-)(konec|konci|[zu]koncit?|vypn[iu]|vypnout|chcipni|umri|prestan|prestanes|das-pokoj|dej-pokoj|polib-mi|polib-si)(-|$)/,
    members:  /(^|-)(manzel|rodin[ua]|syna|deti|parchanty|dceru|kamarad|pr[ia]tel|zen[ua]|fotra?|mamu|maminu|spratky|spunty|mimino(^|-))/
};

module.exports = {
    /**
     *
     * @param {string} keyword
     * @param {string} word
     * @returns {string}
     */
    matches (keyword, word) {
        if (!dict[keyword]) {
            return false;
        }
        return !!dict[keyword].exec(word);
    },

    Network,
    activations,
    regularizations,
    Runner
};