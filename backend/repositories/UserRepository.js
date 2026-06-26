const User = require('../models/User');

class UserRepository {
    async findOne(query) {
        return await User.findOne(query);
    }

    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async update(user) {
        return await user.save();
    }
}

module.exports = new UserRepository();
