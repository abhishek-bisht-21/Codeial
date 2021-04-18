const express = require('express');
const router = express.Router();

// Requiring v1 which is one level below.
router.use('/v1', require('./v1'));

module.exports = router;