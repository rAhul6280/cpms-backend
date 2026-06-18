import { Selection } from "../models/selection.model";
import { Student } from "../models/students.model";
import asyncHandler from "../utils/asyncHandler";

const hireStudent=asyncHandler(async(req,res)=>{
    
    if(req?.user?.role!=='recruiter'){
        return res.status(401).json({success:false,data:{},message:"Unauthorized access!"});
    }
    const {ctc,studentId,selectionRole}=req.body
    const student=await Student.findById(studentId)
    if(!student){
       return res.status(400).json({success:false,data:{},message:"Invalid student id"});
    }
    
    const selection=await Selection.create({
        recruiter:req?.user?.role,
        student:studentId,
        verifiedBy:null,
        status:'pending',
        ctc,
        selectionRole,
    })
    if(!selection){
        return res.status(400).json({success:false,data:{},message:"something went wrong"});
    }
    return res.status(200).json({success:true,data:selection,message:"student selcted successfully!"})

})


export {hireStudent}