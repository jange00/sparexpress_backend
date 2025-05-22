const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken")

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

exports.loginUser = async (req, res) => {
    const {email, password} = req.body
    // Validation
    if(!email || !password){
        return res.status(400).json(
            {
                "success" : false,
                "message" : "Missing Field"
            }
        )
    }
    try{
        const getUser = await User.findOne(
            {"email" : email}
        )
        if(!getUser){
            return res.status(400).json(
                {
                    "success" : false,
                    "message" : "User not found"
                }
            )
        }

        // Check for password
        const passwordCheck = await bcrypt.compare(password, getUser.password)
        if(!password){
            return res.status(400).json(
                {
                    "success" : false,
                    "message" : "Invalid Credentials"
                }
            )
        }
        // jwt
        const payload = {
            "-id" : getUser._id,
            "fullname" : getUser.fullname,
            "email" : getUser.email,
            "phoneNumber" : getUser.phoneNumber
        }

        const token = jwt.sign(payload, process.env.SECRET, {expiresIn: '7d'})
        return res.status(200).json(
            {
                "success" : true,
                "message" : "Login Successful",
                "data" : getUser,
                "token" : token
            }
        )
    }catch(err){
        console.log(err)
        return res.status(500).json(
            {
                "success" : false,
                "message" : "Server error"
            }
        )
    }
}