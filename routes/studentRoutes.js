import express from "express";
import { addOrUpdateStudent, saveCoursePreferences, getStudentById, verifyToken } from "../controllers/studentController.js";
import upload from "../middlewares/upload.js"; // ✅ Import Cloudinary upload middleware
import { addToFavorites, getFavorites, removeFromFavorites } from "../controllers/favoritesController.js";
import getCollegesByRanking from "../controllers/getPreferredCollByRanking.js";
import { getPrivateCollegesByInterest } from "../controllers/filterPrivateColleges.js";
import { registerStudent, loginStudent, sendOtp,verifyOtpAndResetPassword } from "../controllers/authStudent.js";
import { studentRegisterValidate, studentLoginValidate } from "../middlewares/userValidation.js";
import ensureAuthenticated from "../middlewares/auth.js";


const router = express.Router();

// ✅ Student Routes
router.post("/add", upload.single("image"), addOrUpdateStudent); // ✅ Supports image upload
router.put("/preferences", saveCoursePreferences);
router.get("/get/:id", getStudentById);


//favorites
router.post("/favorites/add", addToFavorites);

// ✅ Get Favorite Colleges of a Student
router.get("/favorites/:studentId", getFavorites);

// ✅ Remove College from Favorites
router.post("/favorites/remove", removeFromFavorites);


//get top ranked colleges based on student preferences
router.get("/rankings", getCollegesByRanking);

// ✅ Route to get private colleges based on student's interests
router.post("/private-colleges", getPrivateCollegesByInterest);

//student register login
router.post("/student/register", studentRegisterValidate, registerStudent);
router.post("/student/login", studentLoginValidate, loginStudent);
router.post('/forgot-password/send-otp', sendOtp);
router.post('/forgot-password/verify-otp', verifyOtpAndResetPassword);
router.get("/verify-user/:token", ensureAuthenticated, verifyToken);

export default router;