const express = require('express');
const router = express.Router();
const passport = require('passport')

const commentController = require('../controllers/comments_controller');

// For creating the comment
router.post('/create', passport.checkAuthentication,commentController.create);

// For deleting the comment
router.get('/destroy/:id', passport.checkAuthentication,commentController.destroy);

module.exports = router;