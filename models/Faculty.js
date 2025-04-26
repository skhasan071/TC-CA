import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema(
  {
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
    facultyName: { type: String, required: true },
    designation: { type: String, required: true },
    contactNumber: { type: String, required: true },
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", FacultySchema);

export default Faculty;
