const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Register Controller
exports.registerUser = async (req, res) => {
  const { fullname, email, password, phoneNumber } = req.body;
  console.log(req.body);

  try {
    const profilePicture = req.file?.path;
    console.log("PHOTO",req.file?.path);

    const existingUser = await User.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        msg: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      profilePicture: profilePicture,
    });
    console.log("User", newUser)

    await newUser.save();

    return res.status(201).json({
      success: true,
      msg: "User registered successfully",
    });
  } catch (e) {
    console.error("Error in registerUser:", e);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

// Login Controller
exports.loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  try {
    const getUser = await User.findOne({
      $or: [{ email: identifier }, { phoneNumber: identifier }],
    });

    if (!getUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordCheck = await bcrypt.compare(password, getUser.password);
    if (!passwordCheck) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const payload = {
      _id: getUser._id,
      fullname: getUser.fullname,
      email: getUser.email,
      phoneNumber: getUser.phoneNumber,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: getUser,
      token: token,
    });
  } catch (err) {
    console.error("Error in loginUser:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ✅ Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error("Error in getAllUsers:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ✅ Delete user by ID
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteUser:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ✅ Update user by ID
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { fullname, email, phoneNumber } = req.body;
  const profilePicture = req.file?.path;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname,
        email,
        phoneNumber,
        ...(profilePicture && { profilePicture }),
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Error in updateUser:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
