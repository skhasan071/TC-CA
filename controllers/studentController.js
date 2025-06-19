import Student from "../models/studentModel.js";
import mongoose from "mongoose";

// ✅ Middleware to Check Authentication
import jwt from "jsonwebtoken";

// ✅ Helper function to get user from token
const getUserFromToken = (req) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.split(" ")[1]; // This removes the "Bearer " part
    try {
        return jwt.verify(token, process.env.SECRET);
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return null;
    }
};

// ✅ Add or Update Student Profile
export const addOrUpdateStudent = async (req, res) => {

    try {
        const user = getUserFromToken(req);
        if (!user) {
            return res.status(403).json({ message: "Unauthorized. Please log in." });
        }

        const { name, mobileNumber, studyingIn, city, state, email } = req.body;
        let image = req.file ? req.file.path : null;

        // ✅ Validate required fields
        if (!mobileNumber || !studyingIn || !city || !state|| !name ) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // const mobileRegex = /^[6-9]\d{9}$/;
        // if (!mobileRegex.test(mobileNumber)) {
        //     return res.status(400).json({ message: "Invalid mobile number format." });
        // }


        // ✅ Check if student profile exists for this user
        let student = await Student.findOne({ email: user.email });

        if (student) {
            // ✅ Update existing student profile
            student.mobileNumber = mobileNumber;
            student.studyingIn = studyingIn;
            student.email = email;
            student.name=name;
            student.city = city;
            student.state = state || student.state;
            if (image) student.image = image;

            await student.save();
            return res.status(200).json({ message: "Profile updated successfully", student });

        } else {
            // ✅ Create new student profile
            student = new Student({
                name: user.name, // Take name from registered user
                email: user.email, // Take email from registered user
                mobileNumber,
                studyingIn,
                city,
                image,
                state,
                email,
            });

            await student.save();
            return res.status(201).json({ message: "Profile created successfully", student });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// ✅ Save Course Preferences for a Student
export const saveCoursePreferences = async (req, res) => {
    
    try {
        const user = getUserFromToken(req);
        if (!user) {
            return res.status(403).json({ message: "Unauthorized. Please log in." });
        }

        const { interestedStreams, coursesInterested, preferredYearOfAdmission, preferredCourseLevel, modeOfStudy } = req.body;

        // ✅ Find student by logged-in user's email
        const student = await Student.findOne({ email: user.email });
        if (!student) {
            return res.status(404).json({ message: "Student profile not found. Please complete your profile first." });
        }

        // ✅ Predefined options
        const validStreams = ["Engineering", "Management", "Arts", "Science", "Law", "Medical", "Design", "Humanities"];
        const validCourseLevels = ["UG", "PG", "Diploma(certification)"];
        const validModes = ["Online", "Full-time", "Part-time", "Distance learning"];
        const validYears = ["2025", "2026"];

        // ✅ Validate interestedStreams
        if (interestedStreams) {
            if (!Array.isArray(interestedStreams)) {
                return res.status(400).json({ message: "interestedStreams should be an array." });
            }
            for (let stream of interestedStreams) {
                if (!validStreams.includes(stream)) {
                    return res.status(400).json({message: `Invalid stream: ${stream}`});
                }
            }
            student.interestedStreams = interestedStreams;
        }

        // ✅ Validate coursesInterested
        if (coursesInterested) {
            if (!Array.isArray(coursesInterested)) {
                return res.status(400).json({ message: "coursesInterested should be an array." });
            }
            student.coursesInterested = coursesInterested;
        }

        // ✅ Validate preferredCourseLevel
        if (preferredCourseLevel) {
            if (!validCourseLevels.includes(preferredCourseLevel)) {
                return res.status(400).json({ message: "Invalid preferredCourseLevel." });
            }
            student.preferredCourseLevel = preferredCourseLevel;
        }

        // ✅ Validate modeOfStudy
        if (modeOfStudy) {
            if (!validModes.includes(modeOfStudy)) {
                return res.status(400).json({ message: "Invalid modeOfStudy." });
            }
            student.modeOfStudy = modeOfStudy;
        }

        // ✅ Validate preferredYearOfAdmission
        if (preferredYearOfAdmission) {
            if (!validYears.includes(preferredYearOfAdmission)) {
                return res.status(400).json({ message: "Invalid preferredYearOfAdmission." });
            }
            student.preferredYearOfAdmission = preferredYearOfAdmission;
        }

        // ✅ Save updated student preferences
        await student.save();

        res.status(200).json({ message: "Preferences saved successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getStudentById = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }
  
    try {
      // ❌ Remove .populate('favorites')
      const student = await Student.findById(id);
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.status(200).json(student);
    } catch (error) {
      console.error('Error getting student by ID:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
export const verifyToken = async (req, res) => {
    try {
      // Extract the email from the authenticated user object
      const userEmail = req.authenticatedUser.email;
  
      // Fetch student details from the database using email
      const student = await Student.findOne({ email: userEmail });
  
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      // Return the student details
      return res.status(200).json(student);
    } catch (error) {
      console.error("Error fetching student details:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
};

export const verifyDeleteUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "No such user found" });
    }

    // Successful login
    res.status(200).json({ message: "User found" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  const { email } = req.body;
  console.log("Delete request received for email: ", email); // Debug log

  try {
    // Find the student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Use deleteOne() instead of remove()
    await Student.deleteOne({ email });  // Delete the student by email
    res.status(200).json({ message: "Student profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting student: ", error.message); // Debug log
    res.status(500).json({ message: "Server error", error: error.message });
  }
};