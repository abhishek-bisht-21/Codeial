// const mongoose = require('mongoose');

// // For creating a Schema. We have created a schema whenever
// // we have a collection that goes into the database
// const postSchema = new mongoose.Schema({
//     // Different Fields of the Schema
//     content : {
//         type:String,
//         required : true // Without this the data wont get saved (Empty data wont get saved)
//     },

//     // We are linking it to the user.How we are going to access it is another question
//     user:{
//         type: mongoose.Schema.Types.ObjectId,  //This type is a reference. Whatever post which is going to be created will be linked to a user. It needs to refer to the user schema.
//         ref: 'User' //Telling it to refer to which schema. We told it to refer User
//     },
//     // Include the array ids of all comments in this post schema itself
//     comments: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Comment'
//         }
//     ],
//     likes : [
//         {
//             type:mongoose.Schema.Types.ObjectId,
//             ref:'Like'
//         }
//     ]

// }, {
//     timestamps:true   //This introduces two things createdAt and UpdatedAt
// });

// // Before exporting it we need to tell that this is going to be a model
// // in the database. Name of the model = Post, following the schema of = postSchema
// const Post = mongoose.model('Post',postSchema);

// module.exports = Post;

// // Whereever we need this Post model we will import/require the file /models/post.js


const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'

    },
    // include the array of ids of all comments in this post schema itself
    comments: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
},{
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;