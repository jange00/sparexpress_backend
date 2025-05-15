const mongoose = require("mongoose")

const connectDB = async () => {
    try{
        await mongoose.connect(
            "mongodb://localhost:27017/spareXpress",
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
    }catch(err){
        console.log("DB error",err)
    }
}
module.exports = connectDB