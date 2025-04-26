import mongoose from "mongoose";

const AdmissionProcessSchema = new mongoose.Schema(
    {
        collegeId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
            required: true
        },
       requiredExams: {
            type: [String],
            required: true
        },
        applicationProcess: {
            type: String,
            required: true
        },
        startDate: {
            type: String,
            required: true
        },
        endDate: {
            type: String,
            required: true
        },
        documentsRequired: {
            type: [String], 
            required: true
        },
    
    },
);

const AdmissionProcess = mongoose.model("AdmissionProcess", AdmissionProcessSchema);
export default AdmissionProcess;