import mongoose from "mongoose";

const studentSchema=new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        max:100,
        min:0
    },
    avatar:{
        type:String, //cloudinary url
        default:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
    },
    degree:{
        type:String,
        default:''
    },
    skills:[{type:String}],
    cgpa:{
        type:String,
        default:0
        
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
        type:String
    },
    rollNumber:{
        type:String,
        unique:true
    },
    branch:{
        type:String,
    },
},{timestamps:true})

export const Student=mongoose.model('Student',studentSchema)