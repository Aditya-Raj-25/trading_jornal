const TradingStrategy = require('./TradingStrategy');

class SwingStrategy extends TradingStrategy {
    constructor() {
        super('SWING');
    }

    validateTrade(trade) {
        // Example validation for swing: higher risk limits but larger stop loss ranges
        // Just a mock implementation of strategy logic
        if (trade.riskPercent > 5) {
            console.warn('Swing trades should not exceed 5% risk');
            return false;
        }
        return true;
    }
}

module.exports = SwingStrategy;
