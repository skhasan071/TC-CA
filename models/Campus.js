import mongoose from "mongoose";

const CampusSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true
    },
    amenities: {
      type: [String],
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

const Campus = mongoose.model("Campus", CampusSchema);
export default Campus;
