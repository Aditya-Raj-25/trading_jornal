const TradeService = require('../services/TradeService');

class TradeController {
    async createTrade(req, res) {
        try {
            const trade = await TradeService.createTrade(req.body, req.user.id);
            res.status(201).json(trade);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getTrades(req, res) {
        try {
            const trades = await TradeService.getTrades(req.user.id);
            res.json(trades);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getTradeById(req, res) {
        try {
            const trade = await TradeService.getTradeById(req.params.id, req.user.id);
            res.json(trade);
        } catch (err) {
            if (err.message === 'Trade not found') {
                return res.status(404).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }

    async updateTrade(req, res) {
        try {
            const trade = await TradeService.updateTrade(req.params.id, req.user.id, req.body);
            res.json(trade);
        } catch (err) {
            if (err.message === 'Trade not found') {
                return res.status(404).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }

    async deleteTrade(req, res) {
        try {
            await TradeService.deleteTrade(req.params.id, req.user.id);
            res.json({ message: 'Trade deleted' });
        } catch (err) {
            if (err.message === 'Trade not found') {
                return res.status(404).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new TradeController();
