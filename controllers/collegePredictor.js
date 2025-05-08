import College from "../models/College.js";

export const predictColleges = async (req, res) => {
  const { examType, category, rankType, rankOrPercentile, state } = req.body;

  if (!state || rankOrPercentile === undefined || !rankType) {
    return res.status(400).json({ message: "State, rank/percentile, and rankType are required" });
  }

  try {
    const score = Number(rankOrPercentile);
    const stateFilter = { state: new RegExp(state, "i") };

    let rankRange = {};

    if (rankType === "Percentile") {
      if (score >= 95) {
        rankRange = { ranking: { $lte: 10 } };
      } else if (score >= 85) {
        rankRange = { ranking: { $lte: 30 } };
      } else if (score >= 70) {
        rankRange = { ranking: { $lte: 70 } };
      } else {
        rankRange = {}; // no ranking filter
      }
    } else if (rankType === "Rank") {
      if (score <= 5000) {
        rankRange = { ranking: { $lte: 10 } };
      } else if (score <= 15000) {
        rankRange = { ranking: { $lte: 30 } };
      } else if (score <= 40000) {
        rankRange = { ranking: { $lte: 70 } };
      } else {
        rankRange = {};
      }
    }

    // Step 1: Try match by state + ranking
    let colleges = await College.find({
      ...stateFilter,
      ...rankRange,
    }).sort({ ranking: 1 }).limit(5);

    // Step 2: Fallback — return any top colleges in the state
    if (colleges.length < 2) {
      colleges = await College.find(stateFilter).sort({ ranking: 1 }).limit(2);
    }

    res.status(200).json(colleges);
  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).json({ message: "Prediction failed", error: error.message });
  }
};