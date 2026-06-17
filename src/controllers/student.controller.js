import { Student } from "../models/students.model.js";
import { uploadOnCLoudinary } from "../services/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

const updateProfileInfo=asyncHandler(async(req,res)=>{
    const {role}=req?.user;
    if(!role!=="student"){
        return res.status(401).json({success:false,data:{},message:"Unauthorized access"});
    }
    const{fullName,age,degree,skills,cgpa,projectDetails,address,branch,rollNumber}=req?.body

    if(!fullName || !rollNumber || !cgpa || !degree || !branch ){
        return res.status(400).json({success:false,data:{},message:"All fields are required"});
    }

    if(!Array.isArray(skills)|| skills.length===0){
        return res.status(400).json({success:false,data:{},message:"one skill is required"});
    }

    const resumePath=req?.file?.path
    if(!resumePath){
        return res.status(400).json({success:false,data:{},message:"resume is required"})
    }

    const resp=await uploadOnCLoudinary(resumePath)
    if(!resp?.secure_url){
        return res.status(500).json({success:false,data:{},message:"image upload failed"})
    }

    const newProfile=await Student.findOneAndUpdate({studentId:req?.user?._id},
        {
            $set:{
                fullName,
                age,
                degree,
                skills,
                cgpa,
                projectDetails,
                address,
                branch,
                resume:resp.secure_url
            }
        },
        {
          new: true
        }
    )
    if(!newProfile){
        return res.status(400).json({success:false,data:{},message:"profile updata failed!"});
    }

    res.status(200).json({success:true,data:{},message:"profile updated successfully!"})

})

export {updateProfileInfo};