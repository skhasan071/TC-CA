import College from "../models/College.js";

export const search = async (req, res) => {
  
  try {
    let { search, stream, cities, state } = req.query;

    if (!search || search.trim() === "") {
      return res.status(400).json({ message: "Search text (college name) is required." });
    }

    const streamArray = stream ? (Array.isArray(stream) ? stream : stream.split(",")) : [];
    const stateArray = state ? (Array.isArray(state) ? state : state.split(",")) : [];
    const cityArray = cities ? (Array.isArray(cities) ? cities : cities.split(",")) : [];

    // Validate streams if provided
    const validStreams = ['Engineering', 'Management', 'Arts', 'Science', 'Law', 'Medical', 'Design', 'Humanities'];
    const invalidStreams = streamArray.filter(s => !validStreams.includes(s));
    if (invalidStreams.length > 0) {
      return res.status(400).json({
        message: `Invalid stream(s): ${invalidStreams.join(", ")}. Allowed: ${validStreams.join(", ")}`,
      });
    }

    // Build base query
    let query = {
      name: { $regex: new RegExp(search, "i") }  // case-insensitive partial match
    };

    if (streamArray.length > 0) query.stream = { $in: streamArray };
    if (cityArray.length > 0) query.city = { $in: cityArray };
    if (stateArray.length > 0) query.state = { $in: stateArray };

    const colleges = await College.find(query);

    if (!colleges.length) {
      return res.status(404).json({ message: "No colleges found for the given search." });
    }

    // Sort exact match first
    const sorted = colleges.sort((a, b) =>
      a.name.toLowerCase().startsWith(search.toLowerCase()) ? -1 :
      b.name.toLowerCase().startsWith(search.toLowerCase()) ? 1 : 0
    );

    res.status(200).json(sorted);

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
