const Trade = require('../models/Trade');

class TradeRepository {
    async create(tradeData) {
        const trade = new Trade(tradeData);
        return await trade.save();
    }

    async find(query, sortParams = {}) {
        let queryBuilder = Trade.find(query);
        if (Object.keys(sortParams).length > 0) {
            queryBuilder = queryBuilder.sort(sortParams);
        }
        return await queryBuilder;
    }

    async findOne(query) {
        return await Trade.findOne(query);
    }

    async findOneAndUpdate(query, updateData, options = { new: true }) {
        return await Trade.findOneAndUpdate(query, updateData, options);
    }

    async findOneAndDelete(query) {
        return await Trade.findOneAndDelete(query);
    }
}

module.exports = new TradeRepository();
