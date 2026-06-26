const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');

router.post('/register', AuthController.register.bind(AuthController));
router.post('/login', AuthController.login.bind(AuthController));
router.get('/check-email', AuthController.checkEmail.bind(AuthController));
router.post('/forgot-password', AuthController.forgotPassword.bind(AuthController));
router.post('/reset-password', AuthController.resetPassword.bind(AuthController));

module.exports = router;
