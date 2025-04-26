import Course from "../models/course.js";
import College from "../models/College.js";

export const predictColleges = async (req, res) => {
    try {
        const { examType, category, rankType, rankOrPercentile } = req.body;

        if (!examType || !category || !rankType || rankOrPercentile === undefined) {
            return res.status(400).json({ message: "All fields are required: examType, category, rankType, rankOrPercentile" });
        }

        if (!["Rank", "Percentile"].includes(rankType)) {
            return res.status(400).json({ message: "Invalid rankType. Must be 'Rank' or 'Percentile'." });
        }

        let filterCondition = { examType, category, rankType };

        if (rankType === "Rank") {
            filterCondition.maxRankOrPercentile = { $gte: rankOrPercentile };
        } else {
            filterCondition.maxRankOrPercentile = { $lte: rankOrPercentile };
        }

        // Step 1: Find eligible courses and populate entire college object
        const eligibleCourses = await Course.find(filterCondition).populate("collegeId");

        if (eligibleCourses.length === 0) {
            return res.status(404).json({ message: "No eligible colleges found for this input." });
        }

        // Step 2: Extract unique college documents
        const collegeMap = new Map();

        eligibleCourses.forEach(course => {
            const college = course.collegeId;
            if (college && !collegeMap.has(college._id.toString())) {
                collegeMap.set(college._id.toString(), college);
            }
        });

        // Step 3: Return the full college documents
        const result = Array.from(collegeMap.values());
        res.status(200).json(result);
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
