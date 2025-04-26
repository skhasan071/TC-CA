import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const CollegeAuthSchema = new Schema({
  collegename: { type: String, required: true },
  collegeemail: { type: String, required: true, unique: true },
  collegepassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ReviewSchema = new Schema({
  uid: {type: mongoose.Schema.Types.ObjectId, required: true},
  studentName: {type:String, required: true},
  studentemail: { type: String, required: true },
  rating: { type: Number, required: true },
  reviewtext: { type: String, required: true },
  likes: { type: Number, required: true },
});

const CutoffsSchema = new Schema({
  collegename: { type: String, required: true },
  coursename: { type: String, required: true },
  examname: { type: String, required: true },
  category: { type: String, required: true },
  quota: { type: String, required: true }, // home state OR other state
  cutoffrank: { type: Number, required: true },
  admissionyear: { type: Number, required: true },
});

const scholarshipSchema = new mongoose.Schema({
  ScholarshipName: { type: String, required: true },
  ScholarshipMoney: { type: Number, required: true },
  ScholarshipDescription: { type: String, required: true },
}, { _id: false }); // Disable _id for embedded scholarships

// Define the schema for the Scholarship collection
const scholarshipCollectionSchema = new mongoose.Schema({
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  scholarships: [scholarshipSchema],
});



const filterbyrank = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    nirf_ranking: { type: Number, required: true },
    collegeinfo: { type: String, required: true },
  },
  { timestamps: true }
);

const filterbycountrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    nirf_ranking: { type: Number, required: true },
    collegeinfo: { type: String, required: true },
  },
  { timestamps: true }
);

export const Filterbycountry = mongoose.model(
  "Filterbycountry",
  filterbycountrySchema
);

const UserModel = mongoose.model("students", UserSchema);
const CollegeAuthModel = mongoose.model("collegeauth", CollegeAuthSchema);
const Filterbyrank = mongoose.model("filterbyrank", filterbyrank);
const ReviewModel = mongoose.model("reviews", ReviewSchema);
const CutoffModel = mongoose.model("cutoffs", CutoffsSchema);
const ScholarshipModel = mongoose.model("scholarship",scholarshipCollectionSchema);

export default { Filterbyrank };
// export default ;
export {
  UserModel,
  // CollegeModel,
  CollegeAuthModel,
  ReviewModel,
  CutoffModel,
  ScholarshipModel,
};
