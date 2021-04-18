/*
USERS CONTROLLER :

It can control many users. For example there is model, a schema callled 
user. A json file called user that json file in mongodb will have many user
inside it. Like each document will have 1 user but the collection will
have multiple users. So this is going to control many users

*/

const User = require("../models/users");
const path = require('path');
const fs = require('fs');

/* 
When the Manual Authentication is there

// Now this action is ready to used by a router
module.exports.profile = function (req, res) {
  // return res.end('<h1>User Profile</h1>');
  if (req.cookies.user_id) {
    User.findById(req.cookies.user_id, function (err, user) {
      if (user) {
        return res.render("user_profile", {
          title: "User Profile",
          user:user
        });
      }

      return res.redirect("/user/sign-in");
    });
  } else {
    return res.redirect("/users/sign-in");
  }
};
*/
module.exports.profile = function(req,res){
 User.findById(req.params.id, function(err,user){
  return res.render("user_profile",{
    title:"User profile",
    profile_user :  user
  });

 });
  
}

module.exports.update = async function(req,res){
  /*
  WITHOUT ASYNC AWAIT
  if (req.user.id == req.params.id) {
    // req.params.id is ID by which we want find the user
    User.findByIdAndUpdate(req.params.id, req.body, function(err,user){
      return res.redirect('back');
    });
  } else{
    return res.status(401).send('Unauthorized');
  }
  */

  if (req.user.id == req.params.id) {
      try {

        let user = await User.findById(req.params.id);
        User.uploadedAvatar(req,res,function(err){
            if (err) {
              console.log('*****Multer Error:', err)
            }

            user.name = req.body.name;
            user.email = req.body.email;

            if (req.file) {

              if (user.avatar) {
                fs.unlinkSync(path.join(__dirname, '..', user.avatar));
              }

              // This is saving the path of the uploaded file into the avatar field in the user Schema.
              user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            user.save();
            return res.redirect('back');
        });
        
      } catch (error) {
        req.flash('error', err);
        return res.redirect("back");
      }
  }

  else{
    req.flash('error', 'Unauthorised!');
    return res.status(401).send('Unauthorized');

  }


}

module.exports.friends = function (req, res) {
  return res.end("<h1>Friends are family</h1>");
};

// Render the sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/profile');
  }

  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

// Render the sign in page
module.exports.signIn = function (req, res) {

  if (req.isAuthenticated()) {
    return res.redirect('/users/profile');
  }


  return res.render("user_sign_in", {
    title: "Codeil | Sign In",
  });
};

//Get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in signing up");
      return;
    }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating the user while signing up");
          return;
        }

        return res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};

/*

THIS IS FOR MANUAL AUTHENTICATION:

// Sign In and create a session for the user
module.exports.createSession = function (req, res) {
  // Steps to authenticate:

  // Find the user
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in signing in");
      return;
    }

    // Handle user Found

    if (user) {
      // Handle password which doesn't match
      if (user.password != req.body.password) {
        return res.redirect("back");
      }

      // Handle session creation
      res.cookie("user_id", user.id);
      return res.redirect("/users/profile");
    } else {
      // Handle user not found

      return res.redirect("back");
    }
  });
};

*/



// When passport.js uses local-strategy to authenticate the user, controll comes over here
// this redirects to the homepage. The session is created in passport.js itself.
// Visit users.js in routes there we can see how passport authenticates it.


// Sign in and craete a session for the user
module.exports.createSession = function(req,res){

  // This below statement is on request and what we are sending back is in response.
  // So this msg needs to be transferred into response. For that we will create our own middleware in Config folder.
  req.flash('success' , 'Logged in Successfully');

  return res.redirect('/')
}

module.exports.destroySession = function(req,res){

  req.logout();
  // First argument is the type of Flash Msg and Second is the Msg which will be Displayed.
  req.flash('success' , 'Logged out Successfully');

  return res.redirect('/');
}


/*
For Creating a Session :
1) We are going to check if the user exists
2) If the user exists then we are going to check if the password entered is correct
3) Using the emial we can check whether the user exists or not.
4) Then we can match the password entered in the form with the password in the database
5) If those two passwords match, then we are store the user's identity, in the cookie and
  send it of to the browser


*/
