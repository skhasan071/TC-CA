import mongoose from "mongoose";

const EligibilitySchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  examsAllowed: {
    type: String,
    enum: ["JEE", "CET", "NEET", "BITSAT", "VITEEE", "Other","CAT",
    "CLAT",
    "MH-CET LAW",
    "MAH-CET",
    "SLAT",
    "HSC",
    "SSC",
    "CUET",
    "IPU-CET",
    "KLEE",
    "KEAM",
    "GUJCET",
    "SAJEE",
    "SRMHCAT",
    "TNEA",
  ],
    required: true,
  },
  categoriesAllowed: {
    type: [String],
    enum: ["General", "OBC", "SC", "ST", "EWS", "PWD", "Other"],
    default: ["General"],
  },
});

const Eligibility = mongoose.model("Eligibility", EligibilitySchema);
export default Eligibility;