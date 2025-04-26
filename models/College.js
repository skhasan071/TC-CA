import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },  
    state: { type: String, required: true }, 
    country: { type: String, required: true },
    ranking: { type: Number, required: true },
    brochure: { type: String, required: true },
    naacGrade: { type: String, required: true },
    estYear:{type:String,required:true},
    lat:{type:Number,required:true},
    long:{type:Number,required:true},
    acceptanceRate:{type: String, required: true},
    image: { type: String, required: true },
    collegeInfo: { type: String, required: true },
    
    stream: { 
        type: String, 
        required: true, 
        enum: ['Engineering', 'Management', 'Arts', 'Science', 'Law', 'Medical', 'Design', 'Humanities'] // ✅ Added "Management"
    },
    type: { 
        type: String, 
        required: true, 
        enum: ["Private", "Government"] // ✅ New Field: Type of College
    }
});

const College = mongoose.model("College", CollegeSchema);
export default College;
