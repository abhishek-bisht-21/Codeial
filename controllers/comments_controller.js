const { findById } = require('../models/comment');
const Comment = require('../models/comment');
const Post  = require('../models/post');
const commentsMailer = require('../mailers/comment_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');



/* 

WITHOUT ASYNC AWAIT

// For creating the comment
module.exports.create = function(req,res){
    // req.body.post cause in the form for making a comment there is a input which is hidden and it's name attribute is post.
    Post.findById(req.body.post,function(err,post){

        if (post) {
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            },function(err,comment){
                // Handle error
                if (err) {
                    console.log('Error in creating a comment')
                }

                 req.flash('success', 'Comment Published !');
                
                //  Adding comment to the post schema inside the array of ids of comment. This is in-built in the mongoose it will automatically find comment id and push it inside the array.
                post.comments.push(comment);

                // Whenever we are updating something we need to call save after it. Save tells the database that this is the final version save it. Before that it is just in the memory in the RAM.
                post.save();

                res.redirect('/')
            });
        }
    });
}




// For deleting the comment
module.exports.destroy = function(req,res){

    // Checking if the comment you want to delete exist in the database or not.
    Comment.findById(req.params.id, function(err,comment){

        // Also checking whether Author of comment is the one who trying to delete it.
        if (comment.user == req.user.id) {
            
            // postId signifies to which post this comment belong to.
            // Before deleting the comment we need to fetch the postID of comment. Cause we need to go to the Post inside array and then delete it from there also.
            // We are preserving the postId of the comment before deleting the comment. Cause when we delete comment postID will be lost.
            let postId = comment.post;

            comment.remove();

            req.flash('success','Comment successfully deleted !');

            // using postId to update the comments array inside Post schema.
            Post.findOneAndUpdate(postId, { $pull : {comments: req.params.id}} , function(err,post){
                return res.redirect('back');
            });

        } else{
                req.flash('error','You cannot delete this Post !');
                 return res.redirect("back");
        }
    });
}

*/

// WITH ASYNC AWAIT CODE

// For creating the comment
module.exports.create = async function(req,res){

    try {
        // req.body.post cause in the form for making a comment there is a input which is hidden and it's name attribute is post.
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            // Adding comment to the post schema inside the array of ids of comment. This is in-built in the mongoose it will automatically find comment id and push it inside the array.
            post.comments.push(comment);

            // Whenever we are updating something we need to call save after it. Save tells the database that this is the final version save it. Before that it is just in the memory in the RAM.
            post.save();

             // Similar for comments to fetch the user's id !
            comment = await comment.populate('user','name email').execPopulate();

            // A mail will be send after every new comment made
            // commentsMailer.newComment(comment); This line of code is moved to comment_email_worker.js

            // What queue am I creaing = email
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('error in craeting a queue');
                    return;
                }

                console.log(job.id);
            });


            if (req.xhr) {
                // Similar for comments to fetch the user's id !

                // comment = await comment.populate('user','name').execPopulate();

                return res.status(200).json({
                    data : {
                        comment : comment
                    },

                    message : "Post Created !"
                });
            }

            req.flash('success', 'Comment published !!');

            res.redirect('/');
        }

    } catch (err) {
       console.log('Error',err);
       return ; 
    }
}


// For deleting the comment
module.exports.destroy = async function(req,res){
    try {
        // Checking if the comment you want to delete exist in the database or not.
        let comment = await Comment.findById(req.params.id);

        // Also checking whether Author of comment is the one who trying to delete it.
        if (comment.user == req.user.id) {

            // postId signifies to which post this comment belong to.
            // Before deleting the comment we need to fetch the postID of comment. Cause we need to go to the Post inside array and then delete it from there also.
            // We are preserving the postId of the comment before deleting the comment. Cause when we delete comment postID will be lost.
            let postId = comment.post;

            comment.remove();

            

            // using postId to update the comments array inside Post schema.
            let post = Post.findOneAndUpdate(postId, { $pull : {comments: req.params.id}} );

            // CHANGE :: Destroy associted Likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel:'Comment'});
            
            // send the comment id which was deleted back to the views 
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id : req.params.id
                    },
                    message : "Post Deleted"
                });
            }

            req.flash('success','Comment successfully deleted !');

            return res.redirect('back');

        } else {
            req.flash('error','Unauthorised, You cannot delete this Post !');
            return res.redirect('back');
        }
        
    } catch (err) {
       console.log('Error',err);
       return;
    }
}