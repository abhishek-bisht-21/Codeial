// Here we need to export a function which is publically available to my routes file
//  and also it should return something.

const Post = require("../models/post");

const User = require("../models/users");


// module.exports.home = function (req, res) {
// return res.end('<h1>Express is up for Codeial</h1>');

// Printing a cookie
// console.log(req.cookies);
// // Changing the cookie in the response. changing At the server side basically
// res.cookie('user_id', '25')



//  Without populating the user, fetching only the user id and not the entire user object
/*
Post.find({}, function (err, posts) {
  return res.render("home", {
    title: "Codeil | Home",
    posts: posts
  });
});
}
*/



// Populating the user of each post. And getting the entire the user object.

/*
Without Async Await 
module.exports.home = function (req, res) {
Post.find({}).
populate('user')
.populate({
  path:'comments',
  populate: {
    path: 'user'
  }
})
.exec(function(err,posts){

  User.find({}, function(err,user){
    return res.render('home', {
    title: "Codeil | Home",
    posts: posts,
    all_users: user
  });

  });
  
});

}

Telling it to populate specifically user and then comments. 
Callback function is put into the exec. Generally when we are making query longer we use exec
*/

// With Async Await
module.exports.home = async function (req, res) {

  try {
    // CHANGE :: Populate the likes of each Post and Comment
    let posts = await Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        },
        populate:{
          path : 'likes'
        }
      }).populate('likes');

    let users = await User.find({});

    return res.render('home', {
      title: "Codeial | Home",
      posts: posts,
      all_users: users
    });

  } catch (error) {
    console.log('Error', err);
    return;
  }

}



/*

Earlier we were calling the callback function just like that But now when we are populating
then we have to put that  callback function in other part of the code called as 'exec'
We just shifted the callback function in the exec.


*/

// module.exports.about = function (req, res) {
//   return res.end("<h1>About Page</h1>");
// };
