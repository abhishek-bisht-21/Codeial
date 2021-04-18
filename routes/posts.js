const express = require('express');
const router  = express.Router();
const passport = require('passport');

// Now I can access all the actions that are made in this post controller. With below line.
const postsController = require('../controllers/posts_controller');

// The form is going to be submitted that is why post method is there.
// Specifying the route and then telling the function that we have to use inside postsController
// checkAuthentication to put double check. So that only those who are LogedIn can make post.
router.post('/create',passport.checkAuthentication,postsController.create);
router.get('/destroy/:id', passport.checkAuthentication , postsController.destroy);

module.exports = router;