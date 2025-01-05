const mongoose = require('mongoose')

const msgschema = new mongoose.Schema(
    {
    message : {
        text:{
        type : String,
        required : true
        },
    },
        users: {
            type: Array, // Ensure this is an array of user IDs
            required: true,
          },

    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref:"User",
        required : true
    },
}, 
    {
        timestamps : true,
    },
);

module.exports = mongoose.model("Message",msgschema);