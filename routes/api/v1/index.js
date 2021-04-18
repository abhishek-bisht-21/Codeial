const express = require('express');
const router = express.Router();

// Requiring immediate neighbouring posts
router.use('/posts', require('./posts'));

router.use('/users', require('./users'));

module.exports = router;