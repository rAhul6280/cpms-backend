import { User } from "../models/users.model";
import asyncHandler from "../utils/asyncHandler";

const generateNewAccessToken = (user) => {
  try {
    const accesstoken = user.generateAccessToken();
    return accesstoken;
  } catch (error) {
    throw error;
  }
};

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

  const existedUser = await User.findOne({ email: email });

  if (existedUser) {
    return res
      .status(400)
      .json({ success: false, data: {}, message: "email already exists" });
  }
  const newUser = await User.create({ email, role, password }).select(
    "-password",
  );
  if (!newUser) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "user registration failed!" });
  }
  const newStudent = await User.create({
    studentId: newUser._id,
    fullName,
    age,
    address,
  }).select("fullName age address avatar");
  if (!newStudent) {
    return res
      .status(500)
      .json({ success: false, data: {}, message: "user registration failed!" });
  }
  const accesstoken = generateNewAccessToken(newUser);

  return res
    .status(200)
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
