const mongoose = require('mongoose');

class Database {
    constructor() {
        if (!Database.instance) {
            this.connection = null;
            Database.instance = this;
        }
        return Database.instance;
    }

    async connect(uri) {
        if (this.connection) {
            return this.connection;
        }
        try {
            this.connection = await mongoose.connect(uri);
            console.log('Connected to MongoDB via Singleton');
            return this.connection;
        } catch (err) {
            console.error('Database connection error:', err);
            throw err;
        }
    }
}

const instance = new Database();
module.exports = instance;
