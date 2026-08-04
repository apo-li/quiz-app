const express = require('express')
const router = express.Router()
const createController = require('../controllers/create')

router.get('/create-quiz', createController.showCreate)
router.post('/create-quiz', createController.create)

module.exports = router