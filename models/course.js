import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
    {
        collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
        courseName: { type: String, required: true },
        duration: { type: String, required: true },
        fees: { type: Number, required: true },
        examType: { type: String, required: true },
        category: { type: String, required: true },
        rankType: { type: String, enum: ["Rank", "Percentile", 'Percentage'], required: true },
        maxRankOrPercentile: { type: Number, required: true }
    },
    { timestamps: true }
);

// ✅ Fix: Prevent model overwrite error
const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);

export default Course;