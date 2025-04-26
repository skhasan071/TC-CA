import mongoose from "mongoose";

const HostelSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true
    },
    hostelName: {
      type: String,
      required: true
    },
    hostelAmenities: {
      type: [String],
      required: true
    },
    campusAmenities:{
      type:[String],
      required:true
    },
    hostelInfo: {
      type: String,
      required: true
    },
    photos: {
      type: [String] // Array of Cloudinary image URLs
    },
    videos: {
      type: [String] // Array of Cloudinary video URLs
    }
  },
  { timestamps: true }
);

const Hostel = mongoose.model("Hostel", HostelSchema);
export default Hostel;
