import { Student } from "../models/students.model.js";
import { uploadOnCLoudinary } from "../services/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";

// ── Get student's own profile
const getStudentProfile = asyncHandler(async (req, res) => {
    if (req?.user?.role !== 'student') {
        return res.status(401).json({ success: false, data: {}, message: "Unauthorized access" });
    }

    const student = await Student.findOne({ user: req.user._id }).populate('user', 'email role');
    if (!student) {
        return res.status(404).json({ success: false, data: {}, message: "Student profile not found" });
    }

    return res.status(200).json({ success: true, data: student, message: "Profile fetched successfully!" });
});

// ── Update student profile
const updateProfileInfo = asyncHandler(async (req, res) => {
    const { role } = req?.user;
    if (role !== "student") {
        return res.status(401).json({ success: false, data: {}, message: "Unauthorized access" });
    }
    const { fullName, age, degree, skills, cgpa, projectDetails, address, branch, rollNumber } = req?.body

    if (!fullName || !rollNumber || !cgpa || !degree || !branch) {
        return res.status(400).json({ success: false, data: {}, message: "All fields are required" });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({ success: false, data: {}, message: "one skill is required" });
    }

    

    

    const newProfile = await Student.findOneAndUpdate({ user: req?.user?._id },
        {
            $set: {
                fullName,
                age,
                degree,
                skills,
                cgpa,
                projectDetails,
                address,
                branch,
            }
        },
        {
            returnDocument:'after',
            runValidators:true
        }
    )
    if (!newProfile) {
        return res.status(400).json({ success: false, data: {}, message: "profile updata failed!" });
    }

    res.status(200).json({ success: true, data: {}, message: "profile updated successfully!" })

})


const updateResume = asyncHandler(async (req, res) => {
  try {
    const resumeLocalPath = req.file?.path;
    if (!resumeLocalPath) {
      return res.status(400).json({ success: false, message: "Resume file is missing" });
    }

    const resume = await uploadOnCloudinary(resumeLocalPath);
    if (!resume?.url) {
      return res.status(500).json({ success: false, message: "Resume upload failed" });
    }

    const student = await Student.findOneAndUpdate(
      { user: req.user._id },
      { $set: { resume: resume.url } },
      { returnDocument: 'after', upsert: true }
    );

    return res.status(200).json({ success: true, student });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export { getStudentProfile, updateProfileInfo,updateResume };