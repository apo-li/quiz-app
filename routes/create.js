const express = require('express')
const router = express.Router()
const createController = require('../controllers/create');
const requireAuth = require('../middlewares/requireAuth');

router.get('/create-quiz', requireAuth, createController.showCreate)
router.post('/create-quiz', requireAuth, createController.create)

module.exports = router