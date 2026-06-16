import {Router} from "express"
import { registerUser } from "../controllers/student.controller";

const router=Router();

router.route('/register').post(registerUser)