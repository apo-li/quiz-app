const express = require('express');
const router = express.Router();

// router.use('/', require('./home'));
// router.use('/user', require('./user'));
// router.use('/dashboard', require('./dashboard'));

router.use('/', require('./auth'))
router.use('/', require('./create'))
router.use('/', require('./host'))


module.exports = router;
