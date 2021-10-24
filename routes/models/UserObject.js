const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max:255
    },
    email: {
        type:String,
        required: true,
        min:3,
        max: 255
    },
    phoneNumber:
    {
      type: String,
      required: true,
      max: 1024,
      min:10  
    },
    password:{
        type: String,
        required: true,
        max: 1024,
        min:6
    },
    groups: 
    {
        type:String,
        required:true,
    },
    invites:
    {
        type:String,
        required:true
    },
    date: {
        type:Date,
        default: Date.now
    }
},{ collection : 'users' })

module.exports = mongoose.model("User", User);