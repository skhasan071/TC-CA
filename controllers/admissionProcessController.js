import AdmissionProcess from "../models/admissionProcess.js";
import mongoose from "mongoose";
import College from "../models/College.js";



// ✅ Add Admission Process
export const addAdmissionProcess = async (req, res) => {
  try {
    const {
      collegeId,
      requiredExams,
      applicationProcess,
      startDate,
      endDate,
      documentsRequired,
    } = req.body;

    // ✅ Log incoming data for debug
    console.log("Received Admission Data:", req.body);

    // ✅ Check if all fields are present
    if (
      !collegeId ||
      !requiredExams ||
      !applicationProcess ||
      !startDate ||
      !endDate ||
      !documentsRequired
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Validate CollegeId format
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      return res.status(400).json({ message: "Invalid College ID format" });
    }

    // ✅ Check if College exists (optional, but recommended)
    const collegeExists = await College.findById(collegeId);
    if (!collegeExists) {
      return res.status(404).json({ message: "College not found" });
    }

    // ✅ Create new Admission Process
    const admissionProcess = new AdmissionProcess({
      collegeId,
      requiredExams,
      applicationProcess,
      startDate,
      endDate,
      documentsRequired,
    });

    await admissionProcess.save();

    res.status(201).json({
      message: "Admission process added successfully",
      admissionProcess,
    });
  } catch (error) {
    console.error("Error in addAdmissionProcess:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get Admission Process by College
export const getAdmissionProcessByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;

    const admissionProcess = await AdmissionProcess.findOne({ collegeId });

    if (!admissionProcess) {
      return res.status(404).json({ message: "Admission process not found" });
    }

    res.status(200).json(admissionProcess);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update Admission Process
export const updateAdmissionProcess = async (req, res) => {
  try {
    const { admissionProcessId } = req.params;
    const {
      requiredExams,
      applicationProcess,
      startDate,
      endDate,
      documentsRequired,
    } = req.body;
 

    const updatedAdmissionProcess = await AdmissionProcess.findByIdAndUpdate(
      admissionProcessId,
      {
        collegeId,
        requiredExams,
        applicationProcess,
        startDate,
        endDate,
        documentsRequired,
      },
      { new: true, runValidators: true }
    );

    if (!updatedAdmissionProcess) {
      return res.status(404).json({ message: "Admission process not found" });
    }

    res.status(200).json({
      message: "Admission process updated successfully",
      admissionProcess: updatedAdmissionProcess,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export default {
  addAdmissionProcess,
  getAdmissionProcessByCollege,
  updateAdmissionProcess,
};
