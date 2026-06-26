const StrategyRepository = require('../repositories/StrategyRepository');
const StrategyFactory = require('../factories/StrategyFactory');

class StrategyService {
    async createStrategy(strategyData) {
        // Using StrategyFactory to ensure it's a valid strategy type
        const strategyInstance = StrategyFactory.createStrategy(strategyData.type || 'SWING');
        
        const finalData = {
            ...strategyData,
            name: strategyInstance.name
        };
        return await StrategyRepository.create(finalData);
    }

    async validateTradesAgainstStrategy(trades, strategyType) {
        const strategyInstance = StrategyFactory.createStrategy(strategyType);
        
        return trades.map(trade => ({
            tradeId: trade._id || trade.id,
            isValid: strategyInstance.validateTrade(trade)
        }));
    }

    async calculateStrategyPerformance(strategyId) {
        // Stub implementation
        return {
            strategyId,
            winRate: '50%',
            profitFactor: '1.5'
        };
    }
}

module.exports = new StrategyService();
