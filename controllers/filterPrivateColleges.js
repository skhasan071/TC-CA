import College from "../models/College.js";
import Student from "../models/studentModel.js";

export const getPrivateCollegesByInterest = async (req, res) => {
  
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    // ✅ Fetch student details to get interested streams
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const interestedStreams = student.interestedStreams; // Fetching streams from the student's profile
    if (!interestedStreams || !Array.isArray(interestedStreams) || interestedStreams.length === 0) {
      return res.status(400).json({ message: "Student has no interested streams." });
    }

    console.log("📌 Student's Interested Streams:", interestedStreams);

    // ✅ Find private colleges matching the interested streams
    let privateColleges = await College.find({
      stream: { $in: interestedStreams },
      type: "Private", 
    }).sort({ ranking: 1 }); // ✅ Sorting in ascending order of ranking

    // ✅ Send response
    res.status(200).json({
      message: "Filtered private colleges retrieved successfully",
      colleges: privateColleges,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
