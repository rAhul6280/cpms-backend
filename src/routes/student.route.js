import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { getStudentProfile, updateProfileInfo, updateResume } from "../controllers/student.controller.js";


const router=Router();

router.route('/profile').get(verifyJWT,getStudentProfile)
router.route('/update-profile').patch(verifyJWT,updateProfileInfo)
router.route('/resume').patch(verifyJWT,upload.single('resume'),updateResume)

export default router