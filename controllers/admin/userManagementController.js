const User = require("../../models/userModel")
const bcrypt = require ("bcrypt")

// CRUD
// Create 
exports.createUser = async (req, res) => {
    const {fullname, email, phoneNumber, password} = req.body
    // Validation
    if(!fullname || !email || !phoneNumber || !password){
        return res.status(400).json(
            {
                "success" : false,
                "message" : "Mission field"
            }
        )
    }
    try{
        const existingUser = await User.findOne(
            {
                $or: [{email: email}, {phoneNumber: phoneNumber}]
            }
        )
        if(existingUser){
            return res.status(400).json(
                {
                    "success" : false,
                    "msg" : "User already exists"
                }
            )
        }
        const hashedPassword = await bcrypt.hash(password, 10) // 10 salt/ complexity 
        const newUser = new User(
            {
                fullname: fullname,
                email: email,
                phoneNumber: phoneNumber,
                password: password
            }
        )
        await newUser.save()
        return res.status(201).json(
            {
                "success" : true,
                "msg" : "User Registered"
            }
        )
    }catch(err){
        return res.status(500).json(
            {
                "success" : false,
                "message" : "Server error"
            }
        )
    }
}

// Read All
exports.getUser = async (req, res) => {
    try{
        const users = await User.find();
        return res.status(200).json(
            {
                "success" : true,
                "message" : "Data fetched",
                "data" : users
            }
        )
    }catch(err){
        res.status(500).json(
            {
                "success" : false,
                "message" : "Server error"
            }
        )
    }
}

// get one user 
exports.getOneUser = async (req, res) => {
    try{
        const _id = req.params.id // use mongo id
        const user = await User.findById(_id)
        return res.status(200).json(
            {
                "success" : true,
                "message" : "One user fetched",
                "data" : user
            }
        )
    }catch(err){
        return res.status(500).json(
            {
                "success" : false,
                "message" : "Server error"
            }
        )
    }
}

// update
exports.updateOneUser = async (req, res) => {
    const {fullname} = req.body
    const _id = req.params.id
    try{
        const user = await User.updateOne(
            {
                "_id" : _id
            },
            {
                $set: {
                    "fullname" : fullname
                }
            }
        )
        return res.status(200).json(
            {
                "success" : true,
                "message" : "User data updated"
            }
        )
    }catch(err){
        return res.status(500).json(
            {
                "success" : false,
                "message" : "Server error"
            }
        )
    }
}

// Delete 
exports.deleteOneUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "User deleted successfully"
      });
  
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };
  