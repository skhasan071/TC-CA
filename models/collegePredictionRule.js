import mongoose from "mongoose";

const collegePredictionSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },

  examType: { type: String, required: true },          // e.g., "JEE"
  category: { type: String, required: true },           // e.g., "General"
  rankType: { type: String, enum: ['Rank', 'Percentile'], required: true },

  minRankOrPercentile: { type: Number, required: true },
  maxRankOrPercentile: { type: Number, required: true },
});

export default mongoose.model("CollegePredictionRule", collegePredictionSchema);