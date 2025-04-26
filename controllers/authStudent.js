import Student from "../models/studentModel.js";
import jwt from "jsonwebtoken";

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