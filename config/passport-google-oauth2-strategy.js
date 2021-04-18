// const passport = require('passport');
// const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const crypto = require('crypto');
// const User = require('../models/users');

// // Tell Passport to use new Strategy for Google Log In.
// passport.use(new googleStrategy({
//     clientID: "811439595552-uojsgckpt9t7ks8ij518l4nrkagu5pv0.apps.googleusercontent.com",
//     clientSecret: "NMMydoZvfmANIcQGrKQAC9Vp",
//     callbackURL: "http://localhost:8000/users/auth/google/callback",
// },

//     function (accessToken, refreshToken, profile, done) {
//         // Find a User
//         User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
//             if (err) {
//                 console.log('Error in Google Strategy-passport', err);
//                 return;
//             }

//             if (user) {
//                 // If Found then set this user as req.user
//                 return done(null, user);
//             } else {
//                 // If not found then create the user and set it as req.user
//                 User.create({
//                     name: profile.displayName,
//                     email: profile.emails[0].value,
//                     password: crypto.randomBytes(20).toString('hex')
//                 }, function (err, user) {
//                     if (err) {
//                         console.log('Error in Creating User Google Strategy-passport', err);
//                         return;
//                     }
//                     return done(null,user);
//                 });
//             }
//         });
//     }
// ));

// module.exports = passport;


const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');
const env = require('./environment');


// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: env.google_client_id, 
        clientSecret:env.google_client_secret, 
        callbackURL: env.google_call_back_url
    },

    function(accessToken, refreshToken, profile, done){

        // finding a user by email.Profile has got all the users info, That's y profile.emails is done.
        // email also has multiple fields , So we are specifically telling that we want 'value'.

        User.findOne({email: profile.emails[0].value}).exec(function(err, user){

            if (err){console.log('error in google strategy-passport', err); return;}
            console.log(accessToken, refreshToken);
            console.log(profile);

            if (user){
                // if found, set this user as req.user
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user. Profile has all the users info, so using it to 
                // create the user in the Database.
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if (err){console.log('error in creating user google strategy-passport', err); return;}

                    return done(null, user);
                });
            }

        }); 
    }


));


module.exports = passport;