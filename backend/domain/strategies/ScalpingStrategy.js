const TradingStrategy = require('./TradingStrategy');

class ScalpingStrategy extends TradingStrategy {
    constructor() {
        super('SCALPING');
    }

    validateTrade(trade) {
        // Example validation for scalping: very small risk parameter, short timeframe
        // For demonstration, we simply check if riskPercent is less than 2
        if (trade.riskPercent > 2) {
            console.warn('Scalping trades should not exceed 2% risk');
            return false;
        }
        return true;
    }
}

module.exports = ScalpingStrategy;
