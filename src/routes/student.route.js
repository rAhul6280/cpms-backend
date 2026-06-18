import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { updateProfileInfo } from "../controllers/student.controller.js";


const router=Router();

router.route('/update-profile').path(verifyJWT,upload.single('resume',updateProfileInfo))

export default router