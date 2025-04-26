import College from "../models/College.js";

export const search = async (req, res) => {
  
  try {
    let { search, stream, country, state } = req.query;

    if (!search || search.trim() === "") {
      return res.status(400).json({ message: "Search text (college name) is required." });
    }

    const streamArray = stream ? (Array.isArray(stream) ? stream : stream.split(",")) : [];
    const countryArray = country ? (Array.isArray(country) ? country : country.split(",")) : [];
    const stateArray = state ? (Array.isArray(state) ? state : state.split(",")) : [];

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
    if (countryArray.length > 0) query.country = { $in: countryArray };
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
