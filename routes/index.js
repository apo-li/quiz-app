const express = require('express');
const router = express.Router();

//api routes (to do: get them protected - not available in public)
router.use('/api/users', require('./api/users'))
router.use('/api/quizzes', require('./api/quizzes'))
router.use('/api/questions', require('./api/questions'))

//app routes 
router.use('/', require('./auth'))
router.use('/', require('./create'))
router.use('/', require('./host'))

module.exports = router;
