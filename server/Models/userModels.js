const mongoose = require('mongoose')

const userschema = new mongoose.Schema({  
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        max:50
    },
    isAvatarImageSet:{
        type : Boolean,
        default : false
    },
    avatarImage:{
        type : String,
        default : ""
    }
});

module.exports = mongoose.model("User",userschema);