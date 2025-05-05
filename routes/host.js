const express = require('express')
const router = express.Router()
const hostController = require('../controllers/host')

router.get('/host/:quizId', hostController.showHost)

module.exports = router