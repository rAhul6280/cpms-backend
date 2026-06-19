import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { getStudentProfile, updateProfileInfo } from "../controllers/student.controller.js";


const router=Router();

router.route('/profile').get(verifyJWT,getStudentProfile)
router.route('/update-profile').patch(verifyJWT,upload.single('resume'),updateProfileInfo)

export default router