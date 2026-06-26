class StrategyRepository {
    constructor() {
        this.strategies = []; // In-memory mock since no model exists yet
    }

    async create(strategyData) {
        const newStrategy = { id: Date.now().toString(), ...strategyData };
        this.strategies.push(newStrategy);
        return newStrategy;
    }

    async findOne(query) {
        return this.strategies.find(s => s.id === query.id);
    }
}

module.exports = new StrategyRepository();
