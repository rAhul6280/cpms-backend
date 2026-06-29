import express from 'express'
import verifyJWT from '../middlewares/auth.middleware.js';
import {
    hireStudent,
    getAllStudents,
    getFilteredStudents,
    getStudentById,
    getMySelections,
    getFilteredSelections,
    getRecruiterProfile
} from '../controllers/recruiter.controller.js';

const router = express.Router();

// Studnet browsing
router.route('/students').get(verifyJWT, getAllStudents);
router.route('/students/filter').get(verifyJWT, getFilteredStudents);
router.route('/students/:studentId').get(verifyJWT, getStudentById);

// Selection management
router.route('/hire').post(verifyJWT, hireStudent);
router.route('/selections').get(verifyJWT, getMySelections);
router.route('/selections/filter').get(verifyJWT, getFilteredSelections);

// Profile
router.route('/profile').get(verifyJWT, getRecruiterProfile);

export default router