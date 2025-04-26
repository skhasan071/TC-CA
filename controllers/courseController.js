import Course from "../models/course.js";
import College from "../models/College.js";
import mongoose from "mongoose";

// ✅ Add Course API
export const addCourse = async (req, res) => {
    try {
        const { collegeId, courseName, duration, fees, examType, category, rankType, maxRankOrPercentile } = req.body;

        if (!["Rank", "Percentile"].includes(rankType)) {
            return res.status(400).json({ message: "Invalid rankType. Must be 'Rank' or 'Percentile'." });
        }

        const college = await College.findById(collegeId);
        if (!college) {
            return res.status(404).json({ message: "College not found" });
        }

        const newCourse = new Course({
            collegeId,
            courseName,
            duration,
            fees,
            examType,
            category,
            rankType,
            maxRankOrPercentile
        });

        await newCourse.save();
        res.status(201).json({ message: "Course added successfully", course: newCourse });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Get Courses by College API
export const getCoursesByCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;

        // Check if the collegeId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(collegeId)) {
            return res.status(400).json({ message: "Invalid College ID" });
        }

        // Check if the college exists
        const college = await College.findById(collegeId);
        if (!college) {
            return res.status(404).json({ message: "College not found" });
        }

        // Fetch courses for the college, ensuring collegeId is cast to ObjectId
        const courses = await Course.find({ collegeId: collegeId });

        if (courses.length === 0) {
            return res.status(404).json({ message: "No courses found for this college." });
        }

        res.status(200).json(courses);
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// ✅ Update Course API
export const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { courseName, duration, fees, examType, category, rankType, maxRankOrPercentile } = req.body;

        if (rankType && !["Rank", "Percentile"].includes(rankType)) {
            return res.status(400).json({ message: "Invalid rankType. Must be 'Rank' or 'Percentile'." });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { courseName, duration, fees, examType, category, rankType, maxRankOrPercentile },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course details updated", course: updatedCourse });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
