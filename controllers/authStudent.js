import Student from "../models/studentModel.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import Otp from "../models/otp.js";

// @desc    Register new student
// @route   POST /api/auth/student/register
// @access  Public
export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({ message: "Student already registered" });
    }

    // Create new student
    const newStudent = new Student({ name, email, password });
    await newStudent.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newStudent._id, email: newStudent.email },
      process.env.SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Student registered successfully",
      data: newStudent,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Check if email exists in DB
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Email not registered" });
    }

    // Generate and save OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    await Otp.deleteMany({ email }); // clean old OTPs
    const otpDoc = new Otp({ email, otp: otpCode });
    await otpDoc.save();

    // Send OTP via email
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP for  resetting your password is <b>${otpCode}</b>. It is valid for 5 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const verifyOtpAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find OTP
    const otpDoc = await Otp.findOne({ email, otp });
    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Find user
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update password (no hashing as per your instruction)
    student.password = newPassword;
    await student.save();

    // Cleanup OTP
    await Otp.deleteMany({ email });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// @desc    Login existing student
// @route   POST /api/auth/student/login
// @access  Public
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check password
    if (student.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      data: student,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};