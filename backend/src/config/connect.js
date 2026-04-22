import mongoose from "mongoose";

<<<<<<< HEAD
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export { connectDB };
=======
const connectMongoose = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error Occurred", error);
  }
};

export { connectMongoose };
>>>>>>> e151629300c371c88ad47c69c8f287c72d31726c
