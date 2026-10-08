const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth');
const User = require('../models/user');

router.get ('/', authController.showHome)

router.get('/register', authController.showRegister);
router.post('/register', authController.register);

router.get('/login', authController.showLogin);
router.post('/login', authController.login);

router.get('/dashboard', authController.showDashboard);

router.get('/my-quizzes', authController.showMyQuizzes);

router.get('/logout', authController.logout);

router.get('/verify-email/:token', authController.showEmailVerified);

router.get('/forgot-password', authController.showForgotPassword);
router.post('/forgot-password', authController.forgotPassword);

router.get('/reset-password/:token', authController.showResetPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;