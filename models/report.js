import mongoose from 'mongoose';
const issueSchema = new mongoose.Schema({
  issueType: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: true,
  },
  stepsToReproduce: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Issue = mongoose.model('Issue', issueSchema, 'reportIssue');
export default Issue;