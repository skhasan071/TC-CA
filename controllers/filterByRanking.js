import College from "../models/College.js";

// ✅ Filter Colleges by Stream & Ranking (Ranking is Optional)
export const filterCollegesByRanking = async (req, res) => {
  try {
    const { stream, ranking } = req.query;

    // ✅ Ensure `stream` is provided
    if (!stream) {
      return res.status(400).json({ message: "Stream is required for filtering." });
    }

    // ✅ Define valid streams
    const validStreams = ["Engineering", "Medical", "Law", "Graduation"];
    if (!validStreams.includes(stream)) {
      return res.status(400).json({ message: `Invalid stream. Allowed values: ${validStreams.join(", ")}` });
    }

    // ✅ Build query object
    let query = { stream };

    // ✅ Optional Ranking Filter
    if (ranking) {
      let rankingRange;
      switch (ranking) {
        case "1-5":
          rankingRange = { $gte: 1, $lte: 5 };
          break;
        case "5-10":
          rankingRange = { $gt: 5, $lte: 10 };
          break;
        case "10-50":
          rankingRange = { $gt: 10, $lte: 50 };
          break;
        case "50-100":
          rankingRange = { $gt: 50, $lte: 100 };
          break;
        case ">100":
          rankingRange = { $gt: 100 };
          break;
        default:
          return res.status(400).json({
            message: "Invalid ranking range. Allowed values: 1-5, 5-10, 10-50, 50-100, >100",
          });
      }
      query.ranking = rankingRange;
    }

    // ✅ Fetch colleges based on filters
    const colleges = await College.find(query);

    if (colleges.length === 0) {
      return res.status(404).json({ message: "No colleges found for the given filters." });
    }

    res.status(200).json(colleges);

  } catch (error) {
    console.error("Error filtering colleges by ranking:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
