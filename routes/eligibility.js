import express from 'express';
import { addOrUpdateEligibility, getEligibility } from '../controllers/eligibilityController.js'; // adjust the path based on your project structure

const router = express.Router();

// 🔹 Add or Update Eligibility for a College
router.post('/eligibility', addOrUpdateEligibility);

// 🔹 Get Eligibility by College ID
router.get('/eligibility/:collegeId', getEligibility);

export default router;