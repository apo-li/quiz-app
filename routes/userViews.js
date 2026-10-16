const express = require('express')
const router = express.Router()
const userViews = require('../controllers/userViews');
const requireAuth = require('../middlewares/requireAuth');

router.get('/dashboard', requireAuth, userViews.showDashboard);
router.get('/my-quizzes', requireAuth, userViews.showMyQuizzes);

module.exports = router;