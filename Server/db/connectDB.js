import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongodb connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
