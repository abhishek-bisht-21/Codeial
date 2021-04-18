const { Passport } = require('passport');

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/users')

// Authentication using passport. We need to tell passport to use LocalStrategy
passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
    },
    // done is a callback func which is reporting back to passport.js
    function(req,email,password,done){
        // finding a user by email and establishing the identity
        User.findOne({email: email}, function(err,user){
            if (err) {
                // console.log('Error in finding the user ---> Passport')
                req.flash('error', err);
                return done(err) //This will report an error to the passport
            }

            if (!user || user.password != password) {
                // console.log("Invalid Username/Password")
                req.flash('error','Invalid Username/Password');
                return done(null, false); //Err is null and authentication has not been done (false).
            }

            return done(null,user); //Err is null and user is found so simply returning the user

        });
    }
    
    ));

    // Serializing the user to decide which key is to be kept in the cookies
    passport.serializeUser(function(user,done){
        //This automatically encryptes users id and sets it in the cookie
        done(null,user.id); 
    });



    // Deserializing the user from the key in the cookies
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            if (err) {
                console.log('Error in finding the user ---> Passport')
                return done(err);
            }

            // No error(null) and 'user' because user is found
            return done(null,user);
        });
    });

    // We will be using the below function as a middleware. As its having all the 3 things req,res and next
    // check if the user is authenticated
    passport.checkAuthentication = function(req,res,next){
        // if the user is signed in, then pass on the request to the next function(controllers action)
        if (req.isAuthenticated()) {
            return next();
        }

        // if the user is not signed in
        return res.redirect('/users/sign-in');
    }

    passport.setAuthenticatedUser = function(req,res,next){
        if (req.isAuthenticated()) {
            // req.user contains the current signed in user from the session cookie and we are justsending this to the locals for the views
            res.locals.user = req.user;
        }

        next();
    }

    module.exports = passport;