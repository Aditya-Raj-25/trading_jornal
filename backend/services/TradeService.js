const TradeRepository = require('../repositories/TradeRepository');

class TradeService {
    async createTrade(tradeData, userId) {
        this.validateTradeData(tradeData);
        
        const disciplineScore = this.calculateDisciplineScore(tradeData.checklist);

        const trade = await TradeRepository.create({
            ...tradeData,
            disciplineScore,
            userId
        });
        return trade;
    }

    async getTrades(userId) {
        return await TradeRepository.find({ userId }, { date: -1 });
    }

    async getTradeById(tradeId, userId) {
        const trade = await TradeRepository.findOne({ _id: tradeId, userId });
        if (!trade) {
            throw new Error('Trade not found');
        }
        return trade;
    }

    async updateTrade(tradeId, userId, updateData) {
        let updates = { ...updateData };
        if (updateData.checklist) {
            updates.disciplineScore = this.calculateDisciplineScore(updateData.checklist);
        }

        const trade = await TradeRepository.findOneAndUpdate(
            { _id: tradeId, userId },
            { $set: updates },
            { new: true }
        );

        if (!trade) {
            throw new Error('Trade not found');
        }
        return trade;
    }

    async deleteTrade(tradeId, userId) {
        const trade = await TradeRepository.findOneAndDelete({ _id: tradeId, userId });
        if (!trade) {
            throw new Error('Trade not found');
        }
        return trade;
    }

    calculateDisciplineScore(checklist) {
        if (!checklist) return 0;
        const checklistScore = Object.values(checklist).filter(Boolean).length;
        return (checklistScore / 4) * 100; // Assuming 4 items in checklist
    }

    calculateRiskReward(entry, sl, tp) {
        const risk = Math.abs(entry - sl);
        const reward = Math.abs(tp - entry);
        if (risk === 0) return 0;
        return reward / risk;
    }

    calculateProfitLoss(direction, entry, exit, lotSize) {
        // Simplified P/L calculation, typically depends on asset class
        const diff = direction === 'BUY' ? exit - entry : entry - exit;
        return diff * lotSize;
    }

    validateTradeData(tradeData) {
        if (!tradeData.asset || !tradeData.direction || !tradeData.entry || !tradeData.sl || !tradeData.tp) {
            throw new Error('Missing required trade data');
        }
    }
}

module.exports = new TradeService();
