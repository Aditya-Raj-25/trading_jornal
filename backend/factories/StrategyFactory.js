const ScalpingStrategy = require('../domain/strategies/ScalpingStrategy');
const SwingStrategy = require('../domain/strategies/SwingStrategy');

class StrategyFactory {
    /**
     * @param {string} type 
     * @returns {import('../domain/strategies/TradingStrategy')}
     */
    static createStrategy(type) {
        switch (type.toUpperCase()) {
            case 'SCALPING':
                return new ScalpingStrategy();
            case 'SWING':
                return new SwingStrategy();
            default:
                throw new Error(`Strategy type ${type} is not supported.`);
        }
    }
}

module.exports = StrategyFactory;
