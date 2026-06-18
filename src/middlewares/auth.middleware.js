import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler.js'
import { User } from '../models/users.model.js';

const verifyJWT=asyncHandler(async(req,res,next)=>{
    const token=req?.cookies?.accesstoken || req.headers?.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({success:false,data:{},message:"Unauthorized User"})
    }
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
    const user=await User.findById(decodedToken?._id);
    if(!user){
        return res.status(401).json({success:false,data:{},message:"Invalid or Expired token"});
    }
    req.user=user;
    next();
})

export default verifyJWT