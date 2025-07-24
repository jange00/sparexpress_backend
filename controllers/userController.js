const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const nodemailer = require('nodemailer')

// Register Controller
exports.registerUser = async (req, res) => {
  const { fullname, email, password, phoneNumber } = req.body;
  // console.log(req.body);

  try {
    const profilePicture = req.file?.path;
    // console.log("PHOTO",req.file?.path);

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
    // console.log("User", newUser)

    await newUser.save();

    return res.status(201).json({
      success: true,
      msg: "User registered successfully",
    });
  } catch (e) {
    // console.error("Error in registerUser:", e);
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
    // console.error("Error in loginUser:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    // console.error("Error in getAllUsers:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete user by ID
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
    // console.error("Error in deleteUser:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update user by ID
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
    // console.error("Error in updateUser:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// Get user by ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    // console.error("Error in getUserById:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// forget password
exports.sendResetLink = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "15m",
    });
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // const mailOptions = {
    //   from: `"Your App" <${process.env.EMAIL_USER}>`,
    //   to: email,
    //   subject: "Reset your password",
    //   html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    // };

    const mailOptions = {
      from: `"SpareXpress Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Reset Your SpareXpress Password",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p>Hi there,</p>
          <p>You recently requested to reset your SpareXpress account password.</p>
          <p>
            Click 
            <a href="${resetUrl}" style="color: #eab308; font-weight: bold; text-decoration: none;">
              here
            </a> 
            to reset your password.
          </p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <br/>
          <p>🚗 Regards,<br/><strong>SpareXpress Team</strong></p>
        </div>
      `,
    };
    

    transporter.sendMail(mailOptions, (err, info) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Error sending email" });
      console.log("Email sent: " + info.response);
      res.status(200).json({ success: true, message: "Reset email sent" });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });

    res.status(200).json({ success: true, message: "Password updated" });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Get currently authenticated user
exports.getMe = async (req, res) => {
  try {
    // req.user should be set by authentication middleware
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Change Password Controller
exports.changePassword = async (req, res) => {
  const userId = req.user._id; // assuming you set req.user in your auth middleware
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Both old and new passwords are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    console.error("Change Password Error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
