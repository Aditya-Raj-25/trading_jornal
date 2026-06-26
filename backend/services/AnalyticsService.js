const AnalyticsRepository = require('../repositories/AnalyticsRepository');

class AnalyticsService {
    async getSummary(userId) {
        const trades = await AnalyticsRepository.getUserTrades(userId);
        const totalTrades = trades.length;
        
        if (totalTrades === 0) {
            return {
                totalProfit: 0,
                winRate: 0,
                totalTrades: 0,
                disciplineScore: 0,
                avgRR: 0,
                equityCurve: [],
                mostCommonMistakes: []
            };
        }

        const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
        const wins = trades.filter(t => t.profit > 0).length;
        const winRate = this.calculateWinRate(wins, totalTrades);
        const avgDiscipline = trades.reduce((sum, t) => sum + (t.disciplineScore || 0), 0) / totalTrades;
        const avgRR = this.calculateAverageRR(trades);
        const equityCurve = this.calculateEquityCurve(trades);
        const mostCommonMistakes = this.calculateMostCommonMistakes(trades);
        
        // These are calculated methods based on instructions but maybe not exposed directly yet
        const profitFactor = this.calculateProfitFactor(trades);
        const maxDrawdown = this.calculateMaxDrawdown(equityCurve);

        return {
            totalProfit,
            winRate: winRate.toFixed(2),
            totalTrades,
            disciplineScore: avgDiscipline.toFixed(0),
            avgRR: avgRR.toFixed(2),
            equityCurve,
            mostCommonMistakes,
            // Added to satisfy OOP assignment requirements
            profitFactor: profitFactor.toFixed(2),
            maxDrawdown: maxDrawdown.toFixed(2)
        };
    }

    async getInsights(userId) {
        return { insights: ["Consistency and discipline are key."] };
    }

    calculateWinRate(wins, totalTrades) {
        return totalTrades === 0 ? 0 : (wins / totalTrades) * 100;
    }

    calculateAverageRR(trades) {
        if (trades.length === 0) return 0;
        let totalRR = 0;
        trades.forEach(t => {
            const risk = Math.abs(t.entry - t.sl) || 1; // Prevent div by 0
            const reward = Math.abs(t.tp - t.entry);
            totalRR += (reward / risk);
        });
        return totalRR / trades.length;
    }

    calculateProfitFactor(trades) {
        let grossProfit = 0;
        let grossLoss = 0;
        trades.forEach(t => {
            if (t.profit > 0) grossProfit += t.profit;
            else grossLoss += Math.abs(t.profit);
        });
        return grossLoss === 0 ? grossProfit : grossProfit / grossLoss;
    }

    calculateMaxDrawdown(equityCurve) {
        let maxDrawdown = 0;
        let peak = 0;
        equityCurve.forEach(point => {
            if (point.y > peak) peak = point.y;
            const drawdown = peak - point.y;
            if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        });
        return maxDrawdown;
    }

    calculateEquityCurve(trades) {
        const equityCurve = [];
        let cumPnL = 0;
        trades.forEach((t, index) => {
            cumPnL += t.profit;
            equityCurve.push({ x: index + 1, y: cumPnL });
        });
        return equityCurve;
    }

    calculateMostCommonMistakes(trades) {
        const mistakeCounts = {};
        trades.forEach(t => {
            if (t.mistakes) {
                t.mistakes.forEach(m => {
                    mistakeCounts[m] = (mistakeCounts[m] || 0) + 1;
                });
            }
        });

        return Object.entries(mistakeCounts)
            .map(([mistake, count]) => ({ mistake, count }))
            .sort((a, b) => b.count - a.count);
    }
}

module.exports = new AnalyticsService();
