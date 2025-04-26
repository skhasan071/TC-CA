import Campus from "../models/Campus.js";

// ✅ Add Campus Details
export const addCampus = async (req, res) => {
  try {
    console.log("==== Incoming Request Body ====");
    console.log(req.body);

    console.log("==== Incoming Request Files ====");
    console.log(req.files);

    const { collegeId, amenities } = req.body;

    if (!collegeId || !amenities) {
      return res.status(400).json({ message: "All fields (collegeId, amenities) are required" });
    }

    let amenitiesArray;
    try {
      amenitiesArray = JSON.parse(amenities);
    } catch (error) {
      amenitiesArray = amenities.split(",");
    }

    const photos = req.files?.photos ? req.files.photos.map(file => file.path) : [];
    const videos = req.files?.videos ? req.files.videos.map(file => file.path) : [];

    const campus = new Campus({
      collegeId,
      amenities: amenitiesArray,
      photos,
      videos
    });

    await campus.save();

    res.status(201).json({ message: "Campus details added successfully", campus });
  } catch (error) {
    console.error("❌ Error adding campus:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get Campus by College
export const getCampusByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const campus = await Campus.findOne({ collegeId });

    if (!campus) {
      return res.status(404).json({ message: "Campus details not found" });
    }

    res.status(200).json(campus);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update Campus
export const updateCampus = async (req, res) => {
  try {
    const { campusId } = req.params;
    const { amenities } = req.body;
    const photos = req.files?.photos ? req.files.photos.map(file => file.path) : [];
    const videos = req.files?.videos ? req.files.videos.map(file => file.path) : [];

    const updatedCampus = await Campus.findByIdAndUpdate(
      campusId,
      { amenities, $push: { photos: { $each: photos }, videos: { $each: videos } } },
      { new: true, runValidators: true }
    );

    if (!updatedCampus) {
      return res.status(404).json({ message: "Campus not found" });
    }

    res.status(200).json({ message: "Campus details updated", campus: updatedCampus });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export default { addCampus, getCampusByCollege, updateCampus };
