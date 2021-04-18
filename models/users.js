// const mongoose = require('mongoose');
// const multer = require('multer');
// const path = require('path');
// const AVATAR_PATH = path.join('/uploads/users/avatars');


// // Inside here we need to define different fields.
// // Now we have to define more properties, the email needs to be unique inside the db. 
// // So what do here is define diff properties inside email as an object.
// const userSchema = new mongoose.Schema({

//     email:{
//      type:String,
//      required:true,
//      unique:true
//     },

//     password:{
//         type:String  ,
//         required:true,
//     },

//     name:{
//         type:String,
//         required:true
//     },

//     avatar: {
//         type: String,
//     }

//  }, { timeStamps:true


// });

// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {  //cb is the callback function.
//     cb(null, path.join(__dirname,'..',AVATAR_PATH))  // It has two arguments, 1st is null and 2nd is the exact path where the file needs to be stored.
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' +Date.now());
//   }
// });


// // Static Methods
// userSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
// userSchema.statics.avatarPath = AVATAR_PATH;


// // Telling Mongoose that it is a model. Collection name is User and which schema to refer is userSchema
// const User = mongoose.model('User',userSchema);

// module.exports = User;


// /*

// Uname and Pass are given are importance, other fields are given lesser importance
// coz each time we will be needing them to SignIn.

// One thing we also need is, just to keep a check in the long term is when was the user
// created and when was the user last updated. So whenever we create a new object the database
// should store a field createdAt and whenever we update that object. the database should store a
// field updatedAt.
// From now on every document will have createdAt and updatedAt. Mongoose manages it for us
// timeStamps:true




// */


const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });


// static
userSchema.statics.uploadedAvatar = multer({storage:  storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;



const User = mongoose.model('User', userSchema);

module.exports = User;