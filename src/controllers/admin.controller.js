import { Selection } from "../models/selection.model.js";
import { Student } from "../models/students.model.js";
import asyncHandler from "../utils/asyncHandler.js";


const getAllSelections=asyncHandler(async(req,res)=>{
    if(req?.user?.role!=='admin'){
        return res.status(401).json({success:false,data:{},message:"Unauthorized access"});
    }

    const selectionList=await Selection.aggregate([
        {
            $match:{}
        },
        {
            $sort:{
                updatedAt:1
            }
        },
        {
            $lookup:{
                from:'recruiters',
                localField:'recruiter',
                foreignField:'_id',
                as:'recruiter',
                pipeline:[
                    {
                        $lookup:{
                            from:'users',
                            localField:'user',
                            foreignField:'_id',
                            as:'user',
                            pipeline:[
                                {
                        $project:{
                            email:1,
                            role:1
                        }
                    },
                     {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
          }
        },
                     ]

                        }
                    },
                    
                ]
            }
        },
         {
          $unwind: {
            path: "$recruiter",
            preserveNullAndEmptyArrays: true
          }
        },
        {
            $lookup:{
                from:'students',
                localField:'student',
                foreignField:'_id',
                as:'student',
                pipeline:[
                    {
                        $lookup:{
                            from:'users',
                            localField:'user',
                            foreignField:'_id',
                            as:'user',
                            pipeline:[
                                {
                                 $project:{
                                 email:1,
                                 role:1
                                }
                              }
                            ]
                        }
                    },
                     {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
          }
        },
                    
                ]
            }
        },
         {
          $unwind: {
            path: "$student",
            preserveNullAndEmptyArrays: true
          }
        },
        
    ])

    res.status(200).json({success:true,data:selectionList,message:"All selections fetched successfully!"})
})

const getFilteredSelection=asyncHandler(async(req,res)=>{
    if(req?.user?.role!=='admin'){
        return res.status(401).json({success:false,data:{},message:"Unauthorized access"})
    }
    const {status}=req.query
    if(status!=='pending' && status!=='verified'){
        return res.status(400).json({success:false,data:{},message:"Invalid query"});
    }


    const selectionList=await Selection.aggregate([
        {
            $match:{
                status:status
            }
        },
        {
            $sort:{
                updatedAt:1
            }
        },
        {
            $lookup:{
                from:'recruiters',
                localField:'recruiter',
                foreignField:'_id',
                as:'recruiter',
                pipeline:[
                    {
                        $lookup:{
                            from:'users',
                            localField:'user',
                            foreignField:'_id',
                            as:'user',
                            pipeline:[
                                {
                        $project:{
                            email:1,
                            role:1
                        }
                    },
                     {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
          }
        },
                     ]

                        }
                    },
                    
                ]
            }
        },
         {
          $unwind: {
            path: "$recruiter",
            preserveNullAndEmptyArrays: true
          }
        },
        {
            $lookup:{
                from:'students',
                localField:'student',
                foreignField:'_id',
                as:'student',
                pipeline:[
                    {
                        $lookup:{
                            from:'users',
                            localField:'user',
                            foreignField:'_id',
                            as:'user',
                            pipeline:[
                                {
                                 $project:{
                                 email:1,
                                 role:1
                                }
                              }
                            ]
                        }
                    },
                     {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
          }
        },
                    
                ]
            }
        },
         {
          $unwind: {
            path: "$student",
            preserveNullAndEmptyArrays: true
          }
        },
        
    ])
    
    res.status(200).json({success:true,data:selectionList,message:"Selections fetched successfully!"})
})

export {getAllSelections,getFilteredSelection}