// This is the entry point to all my routes. My app
// index.js file will send a request to routes index.js
// file and this will further send request to diffrent 
// routes.

// There is Module called as Express Router, this helps in seperating our
// routes and controlller. router.use is used to create more sub-division
// There is router.get('/',callbackfunction) , just like we had app.get
// We are going to put this function into another file which will be our
// controller file.
// Whenever we require express it is going to be same instance of express
// which have been required earlier


// index.js is the root of routes. So we want it to control all the other
// routes. So we are going to do router.use('/route_name',require('/routerFile'));



const express = require('express');
const { user } = require('../config/mongoose');

 const router = express.Router();

 const home_Controller = require('../controllers/home_controller');
//  const logout_controller = require('../controllers/logout_controller');

//JUST TO KNOW THIS FILE IS LOADED.
 console.log("Router is Loaded"); 


// To access the controller function in route.
router.get('/',home_Controller.home);



// For any further routes, acces from here.
/*

router.use('/routerName',require('./router.file'));

*/
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/likes', require('./likes'));


router.use('/api',require('./api'));

// router.use('/logout',logout_controller.destroySession);



// We need to export this to make it available to index.js of app file
 module.exports = router;








