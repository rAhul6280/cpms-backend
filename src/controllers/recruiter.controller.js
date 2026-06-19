import { Selection } from "../models/selection.model.js";
import { Student } from "../models/students.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import asyncHandler from "../utils/asyncHandler.js";

//Hire a student
const hireStudent = asyncHandler(async (req, res) => {
    if (req?.user?.role !== 'recruiter') {
        return res.status(401).json({ success: false, data: {}, message: "Unauthorized access!" });
    }
    const { ctc, studentId, selectionRole } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
        return res.status(400).json({ success: false, data: {}, message: "Invalid student id" });
    }

    const recruiter = await Recruiter.findOne({ user: req.user._id });
    if (!recruiter) {
        return res.status(404).json({ success: false, data: {}, message: "Recruiter profile not found" });
    }

    const selection = await Selection.create({
        recruiter: recruiter._id,
        student: studentId,
        status: 'pending',
        ctc,
        selectionRole,
    });
    if (!selection) {
        return res.status(400).json({ success: false, data: {}, message: "something went wrong" });
    }
    return res.status(200).json({ success: true, data: selection, message: "student selected successfully!" });
});

// Get all students 
const getAllStudents = asyncHandler(async (req, res) => {
    if (req?.user?.role !== 'recruiter') {
        return res.status(401).json({ success: false, data: {}, message: "Unauthorized access!" });
    }

    const students = await Student.find().populate('user', 'email role').sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        data: students,
        message: "All students fetched successfully!"
    });
});

//Get filtered students (by skills, branch, degree, minCgpa)
const getFilteredStudents = asyncHandler(async (req, res) => {
    if (req?.user?.role !== 'recruiter') {
        return res.status(401).json({ success: false, data: {}, message: "Unauthorized access!" });
    }

    const { skills, branch, degree, minCgpa } = req.query;
    const matchStage = {};

    if (skills) {
        const skillsArray = skills.split(',').map(s => s.trim());
        matchStage.skills = { $in: skillsArray };
    }

    if (branch) {
        matchStage.branch = { $regex: new RegExp(branch, 'i') };
    }

    if (degree) {
        matchStage.degree = { $regex: new RegExp(degree, 'i') };
    }

    if (minCgpa) {
        matchStage.cgpa = { $gte: minCgpa };
    }

    const students = await Student.aggregate([
        {
            $match: matchStage
        },
        {
            $sort: {
                updatedAt: 1
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
                pipeline: [
                    {
                        $project: {
                            email: 1,
                            role: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true
            }
        }
    ])

    return res.status(200).json({
        success: true,
        data: students,
        message: "Filtered students fetched successfully!"
    });
});

// Get a single student by ID
const getStudentById = asyncHandler(async (req, res) => {
    if (req?.user?.role !== 'recruiter') {
        return res.status(401).json({ success: false, data: {}, message: "Unauthorized access!" });
    }

    const { studentId } = req.params;
    if (!studentId) {
        return res.status(400).json({ success: false, data: {}, message: "Student id is required" });
    }

    const student = await Student.findById(studentId).populate('user', 'email role');
    if (!student) {
        return res.status(404).json({ success: false, data: {}, message: "Student not found" });
    }

    return res.status(200).json({ success: true, data: student, message: "Student fetched successfully!" });
});

//  Get all selections made by the logged-in recruiter 
const getMySelections = asyncHandler(async (req, res) => {
    if (req?.user?.role !== 'recruiter') {
        return res.status(401).json({ success: false, data: {}, message: "Unauthorized access!" });
    }

    const recruiter= await Recruiter.findOne({user:req?.user._id})
    // console.log(recruiter._id);
    

    const selections = await Selection.find({ recruiter:recruiter?._id})
        .populate({
            path: 'student',
            populate: { path: 'user', select: 'email role' }
        })
        .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, data: selections, message: "Selections fetched successfully!" });
});

//Get recruiter's selections filtered by status
const getFilteredSelections = asyncHandler(async (req, res) => {
    if (req?.user?.role !== 'recruiter') {
        return res.status(401).json({ success: false, data: {}, message: "Unauthorized access!" });
    }

    const { status } = req.query;
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, data: {}, message: "Invalid status query. Use pending, approved, or rejected" });
    }

    const recruiter=await Recruiter.findOne({user:req?.user._id})

    const selections = await Selection.find({ recruiter:recruiter._id, status })
        .populate({
            path: 'student',
            populate: { path: 'user', select: 'email role' }
        })
        .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, data: selections, message: "Filtered selections fetched successfully!" });
});

// Get recruiter's own profile 
const getRecruiterProfile = asyncHandler(async (req, res) => {
    if (req?.user?.role !== 'recruiter') {
        return res.status(401).json({ success: false, data: {}, message: "Unauthorized access!" });
    }

    const recruiter = await Recruiter.findOne({ user: req.user._id }).populate('user', 'email role');
    if (!recruiter) {
        return res.status(404).json({ success: false, data: {}, message: "Recruiter profile not found" });
    }

    return res.status(200).json({ success: true, data: recruiter, message: "Profile fetched successfully!" });
});

export {
    hireStudent,
    getAllStudents,
    getFilteredStudents,
    getStudentById,
    getMySelections,
    getFilteredSelections,
    getRecruiterProfile
};