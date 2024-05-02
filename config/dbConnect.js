const mongoose = require("mongoose")
const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB connected succefully ")
    } catch (error) {
        console.log("DB connected falied", error.message);
    }
}

dbConnect();