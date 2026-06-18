import express from 'express'
import verifyJWT from '../middlewares/auth.middleware';
import { hireStudent } from '../controllers/recruiter.controller';

const router=express.Router();

router.route('/select-student').post(verifyJWT,hireStudent)