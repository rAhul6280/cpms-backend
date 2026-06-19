import mongoose from "mongoose";

const selectionSchema=new mongoose.Schema({
    recruiter:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Recruiter',
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
    
    status:{
        type:String,
        enum:['pending','approved','rejected']
    },
    ctc:{
        type:Number
    },
    selectionRole:{
        type:String
    }
},{timestamps:true})

export const Selection=mongoose.model('Selection',selectionSchema)