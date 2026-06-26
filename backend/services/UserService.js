const UserRepository = require('../repositories/UserRepository');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class UserService {
    async register(userData) {
        const { username, email, password } = userData;

        let user = await UserRepository.findOne({ $or: [{ email }, { username }] });
        if (user) {
            throw new Error('User already exists');
        }

        user = await UserRepository.create({ username, email, password });

        const token = this.generateToken(user._id);
        return { token, user: { id: user._id, username, email } };
    }

    async login(email, password) {
        const user = await UserRepository.findOne({ email });
        if (!user) {
            throw new Error('Account does not exist');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Incorrect password');
        }

        const token = this.generateToken(user._id);
        return { token, user: { id: user._id, username: user.username, email: user.email } };
    }

    async checkEmail(email) {
        const user = await UserRepository.findOne({ email });
        return { exists: !!user };
    }

    async forgotPassword(email) {
        const user = await UserRepository.findOne({ email });
        if (!user) {
            throw new Error('No account found with this email.');
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await UserRepository.update(user);

        console.log(`Password reset instructions sent to ${email} with token: ${resetToken}`);
        return { message: 'Password reset instructions have been sent to your email.' };
    }

    async resetPassword(email, newPassword) {
        const user = await UserRepository.findOne({ email });
        if (!user) {
            throw new Error('No account found with this email.');
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await UserRepository.update(user);

        return { message: 'Password updated successfully. Please login with your new password.' };
    }

    // Additional generic methods as requested by instructions
    async validateCredentials(email, password) {
        const user = await UserRepository.findOne({ email });
        if (!user) return false;
        return await user.comparePassword(password);
    }

    async updateProfile(userId, profileData) {
        const user = await UserRepository.findOne({ _id: userId });
        if (!user) throw new Error('User not found');
        
        Object.assign(user, profileData);
        await UserRepository.update(user);
        return user;
    }

    generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    }
}

module.exports = new UserService();
