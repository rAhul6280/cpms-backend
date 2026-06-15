import mongoose from "mongoose";

const studentSchema=new mongoose.Schema({
    studentId={
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    fullName={
        type:String,
        required:true
    },
    age:{
        type:Number,
        max:100,
        min:0
    },
    avatar:{
        type:String //cloudinary url
    },
    degree:{
        type:String,
        required:true
    },
    skills:[{type:String,required:true}],
    cgpa:{
        type:String,
        required:true
    },
    projectDetails:[
        {
            title:String,
            description:String,
            githubLink:String,
            liveLink:String
        }
    ],
    resume:{
        type:String //cloudinary url
    },
    address:{
        city:String,
        state:String,
        pinCode:Number
        
    }
},{timestamps:true})

export const Student=mongoose.model('Student',studentSchema)