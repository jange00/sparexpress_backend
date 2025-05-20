const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  const { fullname, email, password, phoneNumber } = req.body;
  try {
        const existingUser = await User.findOne(
            {
                $or:[{email: email}, {phoneNumber: phoneNumber}]
            }
        )
        if(existingUser){
            return res.status(400).json(
                {
                    "success" : false,
                    "msg" : "User already exist"
                }
            )
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User(
            {
                fullname: fullname,
                email: email,
                phoneNumber: phoneNumber,
                password: hashedPassword
            }
        )
        await newUser.save()
        return res.status(201).json(
            {
                "success" : true,
                "msg" : "User registered"
            }
        )
  } catch (e) {
    return res.status(201).json({
      "success": false,
      "msg": "Server error",
    });
  }
};
