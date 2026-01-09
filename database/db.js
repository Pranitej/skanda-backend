import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set in .env");
  mongoose.set("strictQuery", false);
  mongoose
    .connect(uri)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
}
