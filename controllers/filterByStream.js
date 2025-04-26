import College from "../models/College.js";

// ✅ Filter Colleges by Stream, Country, State, and City
export const filterCollegesByStream = async (req, res) => {
  try {
    let { stream, country, state, city } = req.query;

    // ✅ Ensure `stream` is provided
    if (!stream) {
      return res.status(400).json({ message: "At least one stream is required for filtering." });
    }

    // ✅ Handle single or multiple stream values
    const streamArray = Array.isArray(stream) ? stream : [stream];

    // ✅ Define valid streams
    const validStreams = ['Engineering', 'Management', 'Arts', 'Science', 'Law', 'Medical', 'Design', 'Humanities'];

    // ✅ Validate streams
    const invalidStreams = streamArray.filter(s => !validStreams.includes(s));
    if (invalidStreams.length > 0) {
      return res.status(400).json({
        message: `Invalid stream(s): ${invalidStreams.join(", ")}. Allowed values: ${validStreams.join(", ")}`
      });
    }

    // ✅ Build dynamic query object
    let query = { stream: { $in: streamArray } };

    if (country) query.country = country;
    if (state) query.state = state;
    if (city) query.city = city;

    // ✅ Fetch colleges based on filters
    const colleges = await College.find(query);

    if (colleges.length === 0) {
      return res.status(404).json({ message: "No colleges found for the given filters." });
    }

    res.status(200).json(colleges);

  } catch (error) {
    console.error("Error filtering colleges:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};