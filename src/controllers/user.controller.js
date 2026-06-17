import { Admin } from "../models/admin.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import { Student } from "../models/students.model.js";
import { User } from "../models/users.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateNewAccessToken = (user) => {
  try {
    const accesstoken = user.generateAccessToken();
    return accesstoken;
  } catch (error) {
    throw error;
  }
};
const options = {
  httpOnly: true,
  sameSite: "strict",
}

const registerUser = asyncHandler(async (req, res) => {
  // desturctue information from given by user
  // validate the given info
  // check the email if it already exists
  //register the user
  // now create the student collection with given info
  //genrate and accesstoken for user and sent in response

  const { email, role, password, fullName} = req.body;

  if (!email?.trim() || !password?.trim() || !role?.trim() || !fullName?.trim()) {
    return res
      .status(400)
      .json({ success: false, data: {}, message: "all fields are required" });
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, data: {}, message: "invalid emailId" });
  }
  const allowedRoles = ["student", "recruiter", "admin"];

if (!allowedRoles.includes(role)) {
  return res.status(400).json({
    success: false,
    data: {},
    message: "invalid role"
  });
}

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    return res
      .status(400)
      .json({ success: false, data: {}, message: "email already exists" });
  }
  const newUser = await User.create({ email, role, password })
  if (!newUser) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "user registration failed!" });
  }
  //Doubt what happen if user is created but student creation fails, then we have to delete the user from user collection, so that we can maintain the integrity of data
  let newProfile;
  try {
    
    if (role === "student") {
      newProfile = await Student.create({
        studentId: newUser._id,
        fullName
      })
    } else if (role === "recruiter") {
      newProfile = await Recruiter.create({
        recruiterId: newUser._id,
        fullName,
        companyName:req?.body?.companyName
      })
    }
      else if (role === "admin") {
        newProfile = await Admin.create({
          adminId: newUser._id,
          fullName
        })
    } else {
      return res
        .status(400)
        .json({ success: false, data: {}, message: "invalid role" });
    }
  } catch (error) {
    await User.findByIdAndDelete(newUser._id)
    throw error
  }

  const accesstoken=generateNewAccessToken(newUser);
  return res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .json({
      success: true,
      data: {
        email: newUser.email,
        role: newUser.role,
        fullName: newProfile.fullNamef,
        companyName:newProfile?.companyName
      },
      message: "user registered successfully!",
    });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email.trim() || !password.trim()) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isPasswordMatch = await user.isPasswordCorrect(password);
  if (!isPasswordMatch) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  
  let profileData = null;

  if (user.role === "student") {
     profileData = await Student.findOne({ studentId: user._id }).select("-__v -createdAt -updatedAt  -studentId");
  } else if (user.role === "recruiter") {
     profileData = await Recruiter.findOne({ recruiterId: user._id }).select("-__v -createdAt -updatedAt  -recruiterId");

  } else if (user.role === "admin") {
     profileData = await Admin.findOne({ adminId: user._id }).select("-__v -createdAt -updatedAt -adminId");
  }
  if(!profileData){
    return res.status(404).json({ success: false, message: "User profile not found" });
  }

  const accesstoken = generateNewAccessToken(user);

  return res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .json({
      success: true,
      message: "User logged in successfully!",
      data: {
        email:   user.email,
        role:    user.role,
        profile: profileData,  
      },
    });
});




export { registerUser, loginUser };
