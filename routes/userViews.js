const express = require('express')
const router = express.Router()
const userViews = require('../controllers/userViews');
const viewQuizController = require('../controllers/viewQuiz');
const requireAuth = require('../middlewares/requireAuth');

router.get('/dashboard', requireAuth, userViews.showDashboard);
router.get('/my-quizzes', requireAuth, userViews.showMyQuizzes);
router.get('/view-quiz/:quizId', requireAuth, viewQuizController.showViewQuiz)

module.exports = router