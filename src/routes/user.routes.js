import {Router} from "express"
import { loginUser, registerUser } from "../controllers/user.controller.js";

const router=Router();
//register route
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

//TODO: logout route

export default router;