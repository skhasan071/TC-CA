import Eligibility from "../models/Eligibility.js";

export const addOrUpdateEligibility = async (req, res) => {
  try {
    const { collegeId, examsAllowed, categoriesAllowed } = req.body;

    if (!collegeId || !examsAllowed || !Array.isArray(categoriesAllowed)) {
      return res.status(400).json({ message: "collegeId, examsAllowed, and categoriesAllowed are required" });
    }

    const eligibility = await Eligibility.findOneAndUpdate(
      { collegeId },
      { examsAllowed, categoriesAllowed },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Eligibility info added/updated",
      eligibility,
    });
  } catch (err) {
    console.error("Error in eligibility update:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// 🔹 Get Eligibility by College ID
export const getEligibility = async (req, res) => {
  try {
    const { collegeId } = req.params;

    if (!collegeId) {
      return res.status(400).json({ message: "collegeId is required in params" });
    }

    const eligibility = await Eligibility.findOne({ collegeId });

    if (!eligibility) {
      return res.status(404).json({ message: "No eligibility info found" });
    }

    res.status(200).json(eligibility);
  } catch (err) {
    console.error("Error fetching eligibility:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};