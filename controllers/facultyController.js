import Faculty from "../models/Faculty.js";
import College from "../models/College.js";

// ✅ Add Faculty to a College
export const addFaculty = async (req, res) => {
  try {
    const { collegeId, facultyName, designation, contactNumber } = req.body;

    // Check if the college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    // Create and save the faculty member
    const newFaculty = new Faculty({ collegeId, facultyName, designation, contactNumber });
    await newFaculty.save();

    res.status(201).json({ message: "Faculty added successfully", faculty: newFaculty });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get Faculty by College ID
export const getFacultyByCollege = async (req, res) => {
  try {
    const { collegeId } = req.params;

    // Check if the college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    // Fetch faculty members of this college
    const facultyList = await Faculty.find({ collegeId });

    res.status(200).json(facultyList);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update Faculty Details
export const updateFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { facultyName, designation, contactNumber } = req.body;

    const updatedFaculty = await Faculty.findByIdAndUpdate(
      facultyId,
      { facultyName, designation, contactNumber },
      { new: true }
    );

    if (!updatedFaculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    res.status(200).json({ message: "Faculty details updated", faculty: updatedFaculty });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

