import mongoose from "mongoose";
import config from './config';

const connectDB = async () => {
  try {
    const dbURI = config.mongoDbUri;
    if (!dbURI) throw new Error("MONGO_URI environment variable is not defined");
    await mongoose.connect(dbURI);
    console.log("MongoDB connected successfully");
  } catch(error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;