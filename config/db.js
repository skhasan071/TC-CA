//database connection
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://rinkutalentconnect:7alOjzFvsmPPkeOa@cluster0.0s93c.mongodb.net/DummyData-TC-CA?retryWrites=true&w=majority&appName=Cluster0");
        console.log("MongoDB connected!")
    }
    catch(error){
        console.error("MongoDB connection failed", error);
        process.exit(1);
    }
};
export default connectDB;
