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

  const { email, role, password, fullName, age, address } = req.body;

  if (!email.trim() || !password.trim() || !role.trim() || !fullName.trim()) {
    return res
      .status(400)
      .json({ success: false, data: {}, message: "all fields are required" });
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, data: {}, message: "invalid emailId" });
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
  const newStudent = await Student.create({
    studentId: newUser._id,
    fullName,
    age,
    address,
  })
  if (!newStudent) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "user registration failed!" });
  }
  const accesstoken = generateNewAccessToken(newUser);

  return res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .json({
      success: true,
      data: {
        email: newUser.email,
        role: newUser.role,
        fullName: newStudent.fullName,
        age: newStudent.age,
        address: newStudent.address,
        avatar: newStudent.address,
      },
      message: "user registered successfully!",
    });
});
export { registerUser };
