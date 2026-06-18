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
    verifiedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Admin'
    },
    status:{
        type:String,
        enum:['pending','verified']
    },
    ctc:{
        type:Number
    },
    slectionRole:{
        type:String
    }
},{timestamps:true})

export const Selection=mongoose.model('Selection',selectionSchema)