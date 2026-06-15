import mongoose from "mongoose";

const recruiterSchema=new mongoose.Schema({
    recruiterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    fullName:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Recruiter=mongoose.model('Recruiter',recruiterSchema)