
// CODE WRITTEN HERE IS RESPONSIBLE FOR GENERATING JSON WEB TOKEN
// This is will just like user_controller.js



const User = require('../../../models/users');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');

module.exports.createSession = async function(req,res){

  try {

    let user = await User.findOne({email:req.body.email});

    if (!user || user.password != req.body.password) {
        return res.json(422, {
            message:" Invalid username or Password"
        });
    }

    return res.json(200, {
        message: "Sign in successful,here is your token , keep it safe ",
        data : {
            token: jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '100000'})
        }
    })
      
  } catch (error) {
      console.log('*******',error);

     return res.status(500).json( {
         message: "Internal Server Error"
     })
  }
}