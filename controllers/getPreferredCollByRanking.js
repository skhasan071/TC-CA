import College from "../models/College.js";
import Student from "../models/studentModel.js";

const getCollegesByRanking = async (req, res) => {
    
    try {
        const { studentId } = req.query; // 🔹 Get student ID from query params

        // ✅ Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // ✅ Extract student preferences
        const { interestedStreams, coursesInterested } = student;

        // ✅ Find colleges matching student's preferences & sort by ranking
        const colleges = await College.find({
            $or: [
                { stream: { $in: interestedStreams } }, // Match stream
                { name: { $in: coursesInterested } } // Match course
            ]
        }).sort({ ranking: 1 });

        res.status(200).json({ 
            message: "Filtered colleges sorted by NIRF ranking retrieved successfully", 
            colleges 
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default getCollegesByRanking;
