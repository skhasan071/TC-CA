import mongoose from "mongoose";
import College from "../models/College.js";
import Course from "../models/course.js";

// ✅ Add College with Type (Private/Government)
export const addColleges = async (req, res) => {
  try {
    console.log("Received Body:", req.body);
    console.log("Received Files:", req.files);

    // ✅ Normalize keys in req.body
    const body = Object.keys(req.body).reduce((acc, key) => {
      acc[key.toLowerCase()] = req.body[key]; // Convert all keys to lowercase
      return acc;
    }, {});

    // ✅ Extract fields from normalized body
    const name = body.name;
    const city = body.city;
    const state = body.state;
    const country = body.country;
    const estYear=body.estYear;
    const lat=body.lat;
    const long=body.long;
    const naacGrade=body.naacGrade;
    const acceptanceRate=body.acceptanceRate;
    const ranking = body.ranking;
    const collegeInfo = body.collegeinfo || body.collegeInfo;
    const stream = body.stream;
    const type = body.type; // ✅ Added type field
    const feeRange = body.feeRange;

    // ✅ Extract file URLs from `req.files`
    const image = req.files?.image ? req.files.image[0].path : null;
    const brochure = req.files?.brochure ? req.files.brochure[0].path : null;

    // ✅ Validate all required fields
    if (!name || !state || !city || !ranking || !collegeInfo || !image || !lat || !long ||!brochure || !stream || !country || !type || !naacGrade || !acceptanceRate || !estYear || !feeRange) {
      return res.status(400).json({
        message: "All fields (name, city, state, country, ranking, collegeInfo, image, brochure,lat,long, stream, type, estYear, naacGrade, acceptanceRate, Fee Range ) are required",
      });
    }

    // ✅ Validate type (should be either Private or Government)
    if (!["Private", "Government"].includes(type)) {
      return res.status(400).json({ message: "Type should be either 'Private' or 'Government'" });
    }

    // ✅ Create new college entry with type
    const newCollege = new College({
      name,
      city,
      state,
      country,
      ranking,
      collegeInfo,
      image,
      brochure,
      stream,
      lat,
      long,
      type,
      estYear,
      naacGrade,
      acceptanceRate, // ✅ Added type field
      feeRange
    });

    await newCollege.save();

    res.status(201).json({
      message: "College added successfully",
      college: newCollege,
    });

  } catch (error) {
    console.error("Error adding college:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.toString(),
    });
  }
};

// ✅ Get All Colleges
export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.status(200).json(colleges);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update College
export const updateCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;

    // ✅ Validate College ID
    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      return res.status(400).json({ message: "Invalid College ID format" });
    }

    const { name, city, state, country, ranking, collegeInfo, stream, type,lat,long, feeRange } = req.body;

    // ✅ Validate type (if provided)
    if (type && !["Private", "Government"].includes(type)) {
      return res.status(400).json({ message: "Type should be either 'Private' or 'Government'" });
    }

    // ✅ Handle file updates (if new images are uploaded)
    const image = req.files?.image ? req.files.image[0].path : undefined;
    const brochure = req.files?.brochure ? req.files.brochure[0].path : undefined;

    // ✅ Update the college (only update provided fields)
    const updatedCollege = await College.findByIdAndUpdate(
      collegeId, 
      { name, state, city, ranking, collegeInfo, lat,long,estYear, naacGrade, acceptanceRate, stream, feeRange, type, ...(image && { image }), ...(brochure && { brochure }) }, 
      { new: true, runValidators: true }
    );

    if (!updatedCollege) {
      return res.status(404).json({ message: "College not found" });
    }

    res.status(200).json({
      message: "College details updated successfully",
      college: updatedCollege,
    });

  } catch (error) {
    console.error("Error updating college:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Filter Colleges by Type, Stream, and Course
export const filterColleges = async (req, res) => {
  try {
    const { interestedStreams, coursesInterested, type } = req.body;

    // ✅ Validate interestedStreams
    if (!interestedStreams || !Array.isArray(interestedStreams) || interestedStreams.length === 0) {
      return res.status(400).json({ message: "interestedStreams should be a non-empty array." });
    }

    // ✅ Validate type (if provided)
    if (type && !["Private", "Government"].includes(type)) {
      return res.status(400).json({ message: "Type should be either 'Private' or 'Government'" });
    }

    // ✅ Build query based on filters
    const query = { stream: { $in: interestedStreams } };
    if (type) {
      query.type = type;
    }

    // ✅ Find colleges matching the interested streams and type
    const colleges = await College.find(query);
    let filteredColleges = colleges;

    // ✅ If coursesInterested is provided, filter further
    if (coursesInterested && Array.isArray(coursesInterested) && coursesInterested.length > 0) {
      const courses = await Course.find({ courseName: { $in: coursesInterested } }).populate("collegeId");

      // ✅ Extract unique college IDs from courses
      const collegeIdsFromCourses = [...new Set(courses.map(course => course.collegeId._id.toString()))];

      // ✅ Filter colleges that match streams, type, or have courses of interest
      filteredColleges = colleges.filter(college => 
        collegeIdsFromCourses.includes(college._id.toString())
      );
    }

    res.status(200).json({ message: "Filtered colleges retrieved successfully", colleges: filteredColleges });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
