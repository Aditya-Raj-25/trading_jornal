const Trade = require('../models/Trade');

class AnalyticsRepository {
    async getUserTrades(userId) {
        // Find all trades for a user, sorted by date ascending
        return await Trade.find({ userId }).sort({ date: 1 });
    }
}

module.exports = new AnalyticsRepository();
