import express from "express";
import upload from "../middlewares/upload.js";
import validateCollege from "../middlewares/validateCollege.js";

// Controllers
import { addColleges, getColleges, updateCollege, filterColleges } from "../controllers/collegeController.js";
import { addCourse, getCoursesByCollege, updateCourse } from "../controllers/courseController.js";
import { addFaculty, getFacultyByCollege, updateFaculty } from "../controllers/facultyController.js";
import { addPlacementData, getPlacementByCollege, updatePlacement } from "../controllers/placementController.js";
import { addAdmissionProcess, getAdmissionProcessByCollege, updateAdmissionProcess } from "../controllers/admissionProcessController.js";
import { addHostel, getHostelByCollege, updateHostel } from "../controllers/hostelController.js";
import { addCampus, getCampusByCollege, updateCampus } from "../controllers/campusController.js";
import { filterCollegesByStream } from "../controllers/filterByStream.js";
import { filterCollegesByRanking } from "../controllers/filterByRanking.js";
import {search} from "../controllers/searchController.js";
import{ addQuestion, getQuestionsByCollege } from '../controllers/QAController.js';
import { reportIssue } from '../controllers/reportController.js';
import { feedbackSubmit } from '../controllers/feedbackController.js';
import { predictColleges } from "../controllers/collegePredictor.js";
import { addOrUpdateEligibility, getEligibility } from "../controllers/eligibilityController.js";
import { getCostDetails} from '../controllers/costController.js';

// User Authentication Controllers
import {
  registerUser,
  loginUser,
  registerCollege,
  loginCollege,
  reviewdetails,
  getReviews,
  cutoffdetails,
  scholarshipdetails,
} from "../controllers/index.js";

// Validation Middlewares
import {
  studentRegisterValidate,
  studentLoginValidate,
  collegeRegisterValidate,
  collegeLoginValidate,
  reviewsValidate,
  cutoffsValidate,
  scholarshipsValidate,
} from "../middlewares/userValidation.js";

const router = express.Router();

// ✅ College Routes
router.post("/add", upload.fields([{ name: "image" }, { name: "brochure" }]), validateCollege, addColleges);
router.get("/all", getColleges);
router.put("/update/:collegeId", updateCollege);

//filter
router.post("/filter", filterColleges);

router.get('/questions/:collegeId', getQuestionsByCollege);
router.post('/add-question', addQuestion);

// ✅ Courses & Fees Routes
router.post("/courses/add", addCourse);
router.get("/courses/:collegeId", getCoursesByCollege);
router.put("/courses/update/:courseId", updateCourse);

// ✅ Faculty Routes
router.post("/faculty/add", addFaculty);
router.get("/faculty/:collegeId", getFacultyByCollege);
router.put("/faculty/update/:facultyId", updateFaculty);

// ✅ Placement Routes
router.post("/placement/add", addPlacementData);
router.get("/placement/:collegeId", getPlacementByCollege);
router.put("/placement/update/:placementId", updatePlacement);

// ✅ Admission Process Routes
router.post("/admission/add", addAdmissionProcess);
router.get("/admission/:collegeId", getAdmissionProcessByCollege);
router.put("/admission/update/:admissionProcessId", updateAdmissionProcess);

// ✅ Hostel Routes (Supports Media Uploads)
router.post("/hostel/add", upload.fields([{ name: "photos", maxCount: 5 }, { name: "videos", maxCount: 2 }]), addHostel);
router.get("/hostel/:collegeId", getHostelByCollege);
router.put("/hostel/update/:hostelId", upload.fields([{ name: "photos" }, { name: "videos" }]), updateHostel);

// ✅ Campus Routes (Supports Media Uploads)
router.post("/campus/add", upload.fields([{ name: "photos", maxCount: 5 }, { name: "videos", maxCount: 2 }]), addCampus);
router.get("/campus/:collegeId", getCampusByCollege);
router.put("/campus/update/:campusId", upload.fields([{ name: "photos" }, { name: "videos" }]), updateCampus);

// ✅ Filter Routes
router.get("/filter-by-stream", filterCollegesByStream); // Filter by Stream
router.get("/filter-by-ranking", filterCollegesByRanking); // Filter by Ranking
router.get("/search", search);


// ✅ Authentication & User Routes
router.post("/register", studentRegisterValidate, registerUser);
router.post("/login", studentLoginValidate, loginUser);
router.post("/collegeregister", collegeRegisterValidate, registerCollege);
router.post("/collegelogin", collegeLoginValidate, loginCollege);
router.post("/reviews", reviewsValidate, reviewdetails);
router.get("/reviews/getAll/:uid", getReviews);
router.post("/cutoffs", cutoffsValidate, cutoffdetails);
router.post("/scholarships", scholarshipsValidate, scholarshipdetails);

router.post('/report', reportIssue);
router.post('/feedback', feedbackSubmit);

router.post("/predict", predictColleges);
router.post("/eligibility", addOrUpdateEligibility);
router.get("/eligibility/:collegeId", getEligibility);
router.get('/cost/:collegeId', getCostDetails);

export default router;
