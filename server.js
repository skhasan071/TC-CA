import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import jwt from "jsonwebtoken";// Updated to ES6 import
import twilio from 'twilio';
import Student from "./models/studentModel.js";
import Blog from "./models/blogs.js";
// In your index.js (or the main server file)
import { ScholarshipModel } from './models/userModel.js'; // Ensure correct path
import questionRoutes from './routes/collegeRoutes.js';
import reportRoutes from './routes/collegeRoutes.js';
import feedbackRoutes from './routes/collegeRoutes.js';
import eligibilityRoutes from "./routes/eligibility.js";
import costDetailsRoutes from './routes/collegeRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ✅ Middleware to handle form-data correctly
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Routes
app.use('/api/auth/student', studentRoutes); 
app.use("/api/colleges", collegeRoutes);
app.use("/api/students", studentRoutes); // ✅ Use student routes



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.get('/api/scholarships/:collegeId', async (req, res) => {
  try {
    const collegeId = req.params.collegeId;
    const scholarships = await ScholarshipModel.find({ collegeId });

    if (!scholarships.length) {
      return res.status(404).json({ message: 'No scholarships found for this college' });
    }

    res.status(200).json({ scholarships });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.use((err, req, res, next) => {
    console.error("Global Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: err.toString()
    });
});