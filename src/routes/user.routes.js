import {Router} from "express"
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router=Router();
//register route
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/get-me').get(verifyJWT,getUserProfile)
router.route('/logout').post(verifyJWT,logoutUser)


export default router;