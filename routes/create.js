const express = require('express')
const router = express.Router()
const createController = require('../controllers/create')

// router.get('/create', createController.showCreate)
// router.post('/create', createController.create)

// router.get('/create/add-questions/:quizId', createController.showAddQuestions)
// router.post('/create/add-questions/:quizId', createController.addQuestions)

router.get('/create-quiz', createController.showCreate_v1)
router.post('/create-quiz', createController.create_v1)

module.exports = router