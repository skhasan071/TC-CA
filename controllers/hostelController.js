import Hostel from "../models/Hostel.js";

// ✅ Add a New Hostel
export const addHostel = async (req, res) => {
  try {
    console.log("==== Incoming Request Body ====");
    console.log(req.body);

    console.log("==== Incoming Request Files ====");
    console.log(req.files);

    const { collegeId, hostelName, hostelAmenities, hostelInfo,campusAmenities } = req.body;

    if (!collegeId || !hostelName || !hostelAmenities|| !campusAmenities || !hostelInfo) {
      return res.status(400).json({ message: "All fields (collegeId, hostelName,hostelAmenities, hostelInfo,campusAmenities) are required" });
    }

    // ✅ Extract Cloudinary URLs from Uploaded Files
    const photos = req.files?.photos ? req.files.photos.map(file => file.path) : [];
    const videos = req.files?.videos ? req.files.videos.map(file => file.path) : [];

    const hostel = new Hostel({
      collegeId,
      hostelName,
      hostelAmenities,
      campusAmenities,
      hostelInfo,
      photos,
      videos
    });

    await hostel.save();

    res.status(201).json({ message: "Hostel details added successfully", hostel });
  } catch (error) {
    console.error("❌ Error adding hostel:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get Hostel by College
export const getHostelByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const hostel = await Hostel.findOne({ collegeId });

    if (!hostel) {
      return res.status(404).json({ message: "Hostel details not found" });
    }

    res.status(200).json(hostel);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update Hostel
export const updateHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const { hostelName, hostelAmenities, campusAmenities,hostelInfo } = req.body;
    const photos = req.files?.photos ? req.files.photos.map(file => file.path) : [];
    const videos = req.files?.videos ? req.files.videos.map(file => file.path) : [];

    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostelId,
      { hostelName, hostelAmenities, campusAmenities,hostelInfo, $push: { photos: { $each: photos }, videos: { $each: videos } } },
      { new: true, runValidators: true }
    );

    if (!updatedHostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    res.status(200).json({ message: "Hostel details updated", hostel: updatedHostel });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export default { addHostel, getHostelByCollege, updateHostel };
