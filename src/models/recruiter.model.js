import mongoose from "mongoose";

const recruiterSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    fullName:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    
},{timestamps:true})

export const Recruiter=mongoose.model('Recruiter',recruiterSchema)