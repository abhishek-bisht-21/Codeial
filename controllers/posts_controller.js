// // We need to create a new Post and Post belongs  to the postSchema so we need to import it
// const Post = require("../models/post");
// const Comment = require("../models/comment");
// const Like = require('../models/like');

// /*
// WITHOUT ASYNC AWAIT

// module.exports.create = function(req,res){
//     // We will create a new post from the data we received from the form.
//     Post.create({

//     //In the form made in home.ejs . The text area has a field called "name" which is equal to "content". That's y req.body.content.
//     // Also the field in the post.js in models folder is also content. Therefore content is made equal to req.body.content, we can therefore save the data coming from the form directly into the post.

//     content:req.body.content, 
    
//     // We also need to save the user who is logedin. We just needed to store the id and not the entire user object. Cause id is going to be unique in the whole database.

//     user: req.user._id

// }, function(err,post){ //callback function
//     if (err) {
//         console.log('error in creating a post');
//         return;
//     }

//     return res.redirect('back');

//     });
// }
// */

// // WITH ASYNC AWAIT

// module.exports.create = async function (req, res) {
//   try {
//     let post = await Post.create({
//       content: req.body.content,
//       user: req.user._id,
//     });

//     if (req.xhr) {
//       return res.status(200).json({
//         data:{
//           post:post
//         },
//         message: "Post created !"
//       });
//     }

//     req.flash('success', 'Post Published !');
//     return res.redirect("back");

//   } catch (error) {
//     req.flash('error', err);
//     return res.redirect("back");
//   }
// };

// module.exports.destroy = async function (req, res) {

//   try {
//     // Finding by id if the Post we are trying to delete exist in the database or not.
//     let post = await Post.findById(req.params.id);

//     // Putting the check so that only the Author of the Post can Delete it
//     // .id means converting the object id into string. This is necessary for comparison because when we are comparing two object ids they both need to be string format.
//     if (post.user == req.user.id) {

//       // CHANGE :: Delete the associated Likes for the post and all its comments likes too
//       await Like.deleteMany({likeable: post, onModel: 'Post'});
//       await Like.deleteMany({_id:{$in: post.comments}});



//       post.remove();

//       // Deleting all the comments based on some query. Strings are being matched. Delete those comments whose posts have this specific id.
//       await Comment.deleteMany({ post: req.params.id });

//       if(req.xhr){
//         return res.status(200).json({
//           data: {
//             post_id: req.params.id
//           },
//           message: " Post Deleted"
//         });
//       }
      
//       req.flash('success','Post and associated comments deleted !');

//       return res.redirect("back");

//     } else {

//       req.flash('error','You cannot delete this Post !');
//       return res.redirect("back");
//     }

//   }  catch (error) {
//     req.flash('error', error);
//      return res.redirect("back");
//   }
// };

// /*
// Here we are just creating a post and passing on the user. Right now we have not put an check 
// that whether the user is signed in or not.
// */


const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        
        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
  
}


module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id){

            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});



            post.remove();

            await Comment.deleteMany({post: req.params.id});


            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}
