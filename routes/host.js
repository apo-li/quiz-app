const express = require('express')
const router = express.Router()
const hostController = require('../controllers/host');
const requireAuth = require('../middlewares/requireAuth');

router.get('/host/:quizId', requireAuth, hostController.showHost)

module.exports = router