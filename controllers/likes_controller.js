const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function(req,res){

    try {

        // Our URL will be shaped in this way ---> likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false;
        
        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }
        else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }


        // check if a like already exists

        let existingLike = await Like.findOne({
            likeable:req.query.id,
            onModel: req.query.type,
            user: req.query._id
        })

        // If a like already exists, then delete it
        if (existingLike) {

            // This is how we pull it off , from the Like Array
            likeable.likes.pull(existingLike._id);

            likeable.save();

            existingLike.remove();
            deleted = true;
        }

        // Else create a new like
        else{

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type

            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message: "Request Successful!",
            data : {
                deleted : deleted
            }
        })
        
    } catch (error) {
       console.log(error);
       return   res.status(500).json({
        message:'Internal Server Error'
       });
    }
}