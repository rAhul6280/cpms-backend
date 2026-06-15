import mongoose from "mongoose";

const adminSchema=new mongoose.Schema({
    adminId:{
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
    }

},{timestamps:true})

export const Admin=mongoose.model('Admin',adminSchema)