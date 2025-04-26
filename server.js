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



dotenv.config();
connectDB();

const app = express();

// ✅ Middleware to handle form-data correctly
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// ✅ Routes
app.use("/api/colleges", collegeRoutes);
app.use("/api/students", studentRoutes); // ✅ Use student routes
app.use('/api', questionRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Endpoint to handle Google authentication
  app.post("/auth/google-auth", async (req, res) => {
    const { email, name } = req.body;

    try {

      let user = await Student.findOne({ email });
  
      let redirect = true;
      
      if (user) {
        // User exists, generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: "User authenticated", token, redirect });
      } else {
        // User doesn't exist, create the user
        user = new Student({email, name});
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        redirect = true; // Redirect if user is newly created
        return res.status(200).json({ message: "User registered", token, redirect });
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid Access Token", error: error.message });
    }
  });
  const Tclient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  // In-memory store (use Redis or DB in production)
  const otpStore = new Map();
  
  function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  // Send OTP
  app.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    const otp = generateOTP();
  
    otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // Expires in 5 mins
  
    try {
      await Tclient.messages.create({
        body: "Your OTP is ${otp}",
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      res.json({ success: true, message: 'OTP sent' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
  
  // Verify OTP
  app.post('/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
    const record = otpStore.get(phone);
  
    if (!record) {
      return res.status(400).json({ success: false, message: 'No OTP found for this number' });
    }
  
    if (Date.now() > record.expiresAt) {
      otpStore.delete(phone);
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
  
    if (otp === record.otp) {
      otpStore.delete(phone);
      return res.json({ success: true, message: 'OTP verified' });
    }
  
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  });

// Blog Routes
app.post('/api/blogs', async (req, res) => {
  const {
    title,
    category,
    readingTime,
    description,
    content,
    contributors,
    image,
  } = req.body;

  try {
    const newBlog = new Blog({
      title,
      category,
      readingTime,
      description,
      content,
      contributors,
      image: image || 'assets/gmail-logo.jpg',  // Default image if not provided
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error });
  }
});

// Fetch all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();  // Fetch all blogs from the database
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error });
  }
});
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
