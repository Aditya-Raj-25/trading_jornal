/**
 * Base Strategy Class (Interface-like)
 * Implements the ITradingStrategy interface from index.d.ts implicitly via JS.
 */
class TradingStrategy {
    constructor(name) {
        if (this.constructor === TradingStrategy) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.name = name;
    }

    /**
     * @param {Object} trade
     * @returns {boolean}
     */
    validateTrade(trade) {
        throw new Error("Method 'validateTrade()' must be implemented.");
    }

    /**
     * @param {number} entry
     * @param {number} sl
     * @returns {number}
     */
    calculateRisk(entry, sl) {
        return Math.abs(entry - sl);
    }
}

module.exports = TradingStrategy;
