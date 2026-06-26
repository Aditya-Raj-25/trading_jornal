const UserService = require('../services/UserService');

class AuthController {
    async register(req, res) {
        try {
            const result = await UserService.register(req.body);
            res.status(201).json(result);
        } catch (err) {
            if (err.message === 'User already exists') {
                return res.status(400).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await UserService.login(email, password);
            res.json(result);
        } catch (err) {
            if (err.message === 'Account does not exist' || err.message === 'Incorrect password') {
                return res.status(400).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }

    async checkEmail(req, res) {
        try {
            const { email } = req.query;
            if (!email) return res.status(400).json({ message: 'Email is required' });

            const result = await UserService.checkEmail(email);
            res.json(result);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const result = await UserService.forgotPassword(email);
            res.json(result);
        } catch (err) {
            if (err.message === 'No account found with this email.') {
                return res.status(404).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { email, newPassword } = req.body;
            const result = await UserService.resetPassword(email, newPassword);
            res.json(result);
        } catch (err) {
            if (err.message === 'No account found with this email.') {
                return res.status(404).json({ message: err.message });
            }
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new AuthController();
