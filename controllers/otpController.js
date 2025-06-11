import jwt from 'jsonwebtoken';
import twilio from 'twilio'; // Directly import Twilio here
import Student from "../models/studentModel.js";

// In-memory store for OTPs
const otpStore = new Map();

// Initialize Twilio client
const Tclient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Send OTP
export const sendOTP = async (req, res) => {
  const { phone } = req.body;
  const otp = generateOTP();

  // Store OTP and set expiration (expires in 5 mins)
  otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  try {
    // Send OTP using Twilio
    await Tclient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  const record = otpStore.get(phone);

  if (!record) {
    return res.status(400).json({ success: false, message: 'No OTP found for this number' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone); // Clear expired OTP
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (otp === record.otp) {
    otpStore.delete(phone); // Clear OTP after successful verification

    const student = new Student({ mobileNumber: phone });
    await student.save();

    const token = jwt.sign(
      { id: student._id, mobileNumber: student.mobileNumber },
      process.env.SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ success: true, message: 'OTP verified', token, data: student });
  }

  res.status(400).json({ success: false, message: 'Invalid OTP' });
};
