import Issue from '../models/report.js';

export const reportIssue = async (req, res) => {
  try {
    const {
      issueType,
      profession,
      name,
      email,
      description,
      stepsToReproduce,
    } = req.body;

    const newIssue = new Issue({
      issueType,
      profession,
      name,
      email,
      description,
      stepsToReproduce,
    });

    await newIssue.save();

    res.status(201).json({ message: 'Issue reported successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to report issue', detail: error.message });
  }
};
