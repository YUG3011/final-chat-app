import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log(error);
        
    }
}

export default dbConnect;