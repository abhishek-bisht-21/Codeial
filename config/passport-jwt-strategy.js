const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
// We are now importing an module which will helps us extract JWT from the Header.
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');

const User = require('../models/users');
const { user } = require('./mongoose');

let opts = {

    // Header is a list of keys and Header has a key called Authorization and that 
    // Also is a list of keys, and that can have a key called as Bearer. 
    // Now that bearer will be having the jwt Token.
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),

    // This is our Encryption and Decryption Key
    secretOrKey:env.jwt_secret
}


passport.use(new JWTStrategy(opts, function(jwtPayLoad,done){
    User.findById(jwtPayLoad._id, function(err,user){
        if (err) {
            console.log('Error in finding the user from JWT');
            return;
        }

        if (user) {
          return  done(null,user);
        }

        else{
            // false means the user was not found.
            return done(null,false);
        }
    })
}));

module.exports = passport;