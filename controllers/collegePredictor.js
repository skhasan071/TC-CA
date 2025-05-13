import College from "../models/College.js";
import Eligibility from "../models/Eligibility.js";

export const predictColleges = async (req, res) => {
  const { examType, category, rankType, rankOrPercentile, state } = req.body;

  if (!state || rankOrPercentile === undefined || !rankType || !category || !examType) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["Rank", "Percentile"].includes(rankType)) {
    return res.status(400).json({ message: "Invalid rankType" });
  }

  try {
    const score = Number(rankOrPercentile);

    // Step 1: Filter colleges by state
    let colleges = await College.find({ state: new RegExp(state, "i") });

    // Step 2: Filter by rank
    let rankFilter = {};
    if (rankType === "Percentile") {
      if (score >= 95) rankFilter = { ranking: { $lte: 10 } };
      else if (score >= 85) rankFilter = { ranking: { $lte: 30 } };
      else if (score >= 70) rankFilter = { ranking: { $lte: 70 } };
    } else {
      if (score <= 5000) rankFilter = { ranking: { $lte: 10 } };
      else if (score <= 15000) rankFilter = { ranking: { $lte: 30 } };
      else if (score <= 40000) rankFilter = { ranking: { $lte: 70 } };
    }

    colleges = colleges.filter(college =>
      !rankFilter.ranking || college.ranking <= rankFilter.ranking.$lte
    );

    // Step 3: Filter by examsAllowed
    const eligibleForExam = await Eligibility.find({ examsAllowed: examType });
    const examEligibleIds = new Set(eligibleForExam.map(e => e.collegeId.toString()));
    colleges = colleges.filter(college => examEligibleIds.has(college._id.toString()));

    // Step 4: Filter by category
    const finalEligibility = await Eligibility.find({
      examsAllowed: examType,
      categoriesAllowed: { $in: [category] },
    });
    const finalEligibleIds = new Set(finalEligibility.map(e => e.collegeId.toString()));
    colleges = colleges.filter(college => finalEligibleIds.has(college._id.toString()));

    // Step 5: Fallback logic if only ≤ 2 colleges remain
    if (colleges.length <= 2) {
      const fallbackEligibility = await Eligibility.find({
        examsAllowed: examType,
        categoriesAllowed: { $in: [category] },
      });

      const fallbackEligibleIds = fallbackEligibility.map(e => e.collegeId.toString());

      const fallbackColleges = await College.find({
        _id: { $in: fallbackEligibleIds },
        state: new RegExp(state, "i"),
        ranking: { $gt: 50, $lte: 100 }
      }).sort({ ranking: 1 }).limit(5);

      const uniqueFallbacks = fallbackColleges.filter(
        fb => !colleges.some(c => c._id.toString() === fb._id.toString())
      );

      colleges.push(...uniqueFallbacks);
    }

    if (!colleges.length) {
      return res.status(404).json({ message: "No colleges found after narrowing down" });
    }

    res.status(200).json(colleges.sort((a, b) => a.ranking - b.ranking));
  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).json({ message: "Prediction failed", error: error.message });
  }
};