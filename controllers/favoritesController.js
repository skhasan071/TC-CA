import Student from "../models/studentModel.js";
import College from "../models/College.js";

// ✅ Add College to Favorites
export const addToFavorites = async (req, res) => {
    try {
        const { studentId, collegeId } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (!collegeId) {
            return res.status(400).json({ message: "College ID is required" });
        }

        if (student.favorites.includes(collegeId)) {
            return res.status(400).json({ message: "College is already in favorites" });
        }

        student.favorites.push(collegeId);
        await student.save();

        res.status(200).json({ message: "College added to favorites", favorites: student.favorites });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Get Favorite Colleges
export const getFavorites = async (req, res) => {
    try {
        const { studentId } = req.params;

        const student = await Student.findById(studentId).populate("favorites"); // Fetch full college details
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Favorite colleges retrieved successfully", favorites: student.favorites });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Remove College from Favorites
export const removeFromFavorites = async (req, res) => {
    try {
        const { studentId, collegeId } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (!student.favorites.includes(collegeId)) {
            return res.status(400).json({ message: "College not found in favorites" });
        }

        student.favorites = student.favorites.filter(id => id.toString() !== collegeId);
        await student.save();

        res.status(200).json({ message: "College removed from favorites", favorites: student.favorites });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
