const TradeRepository = require('../repositories/TradeRepository');

class WeeklyReviewService {
    async generateWeeklySummary(userId, startDate, endDate) {
        const trades = await TradeRepository.find({
            userId,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });
        
        return {
            totalTrades: trades.length,
            bestTrade: this.findBestTrade(trades),
            worstTrade: this.findWorstTrade(trades),
            disciplineScore: this.calculateWeeklyDiscipline(trades)
        };
    }

    findBestTrade(trades) {
        if (!trades.length) return null;
        return trades.reduce((best, current) => current.profit > best.profit ? current : best, trades[0]);
    }

    findWorstTrade(trades) {
        if (!trades.length) return null;
        return trades.reduce((worst, current) => current.profit < worst.profit ? current : worst, trades[0]);
    }

    calculateWeeklyDiscipline(trades) {
        if (!trades.length) return 0;
        const total = trades.reduce((sum, t) => sum + (t.disciplineScore || 0), 0);
        return total / trades.length;
    }
}

module.exports = new WeeklyReviewService();
