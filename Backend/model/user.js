const mongoose = require("mongoose")

const userShcema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["Admin","User"],
        default:"User",
    },
},{timestamps:true})


const User = mongoose.model("user",userShcema)

module.exports = User