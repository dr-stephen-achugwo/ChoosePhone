// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

async function connectToDatabase(URI) {
  if (!URI) {
    console.error("MongoDB URI is undefined. Please check your environment variables.");
    return;
  }

  try {
    await mongoose.connect(URI); // No need for deprecated options
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

export default connectToDatabase;
