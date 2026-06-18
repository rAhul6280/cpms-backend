import mongoose from "mongoose";

const adminSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    department:{
        type:String,
    },
    avatar:{
        type:String, //cloudinary url
        default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }

},{timestamps:true})

export const Admin=mongoose.model('Admin',adminSchema)