const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsApi = require("../../../controllers/api/v1/posts_api");

// Using index function inside Controller->api->v1->posts_api.js
router.get('/', postsApi.index);

// session is put false. Cause we donot want the session cookie to generated.file
// Also we are telling passport to authenticate via jwt strategy
router.delete('/:id',passport.authenticate('jwt',{session:false}) ,postsApi.destroy);

module.exports = router;