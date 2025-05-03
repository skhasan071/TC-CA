import feedbackSave from '../models/feedback.js';

export const feedbackSubmit = async (req, res) => {
  try {
    const {
    feedbackType,
      profession,
      name,
      email,
      feedback,
    } = req.body;

    const newFeedback = new feedbackSave({
        feedbackType,
      profession,
      name,
      email,
      feedback,
     
    });

    await newFeedback.save();

    res.status(201).json({ message: 'Feedback Submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to give Feedback', detail: error.message });
  }
};