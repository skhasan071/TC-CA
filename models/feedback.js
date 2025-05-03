import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  feedbackType: {
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
  feedback: {
    type: String,
    required: true,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const feedbackSave = mongoose.model('feedbackSave', feedbackSchema, 'feedback');
export default feedbackSave;