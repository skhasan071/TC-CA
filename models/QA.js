import mongoose from 'mongoose';

const questionItemSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    default: ''
  },
  user: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const questionSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  questions: [questionItemSchema] // Array of question objects
});

const Answer = mongoose.model('Answer', questionSchema, 'Question');
export default Answer;