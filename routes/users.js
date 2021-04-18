const express = require('express');
const router  = express.Router();
// Requiring passport
const passport = require('passport');

const usersController = require('../controllers/users_controller');

// Making profile page visible/available only when the user is signed in. passport.checkAuthentication does that
router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.post('/update/:id',passport.checkAuthentication,usersController.update);


router.get('/friends',usersController.friends);
router.get('/sign-up', usersController.signUp);
router.get('/sign-in',usersController.signIn);

router.post('/create',usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect : '/users/sign-in'}
),usersController.createSession);

router.get('/sign-out',usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);




module.exports = router;

/*
Passport first Authenticates it. If the authentication is successful, then done function returns the user
pass.authenticate is a function and it takes two arguments
'local' which means the strategy used is local
When user fails to authenticate {failureRedirect : '/users/sign-in'}


If authentication is done then usersController.createSession function is called

*/
