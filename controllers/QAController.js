import Answer from '../models/QA.js';
import mongoose from 'mongoose'; // Import the Question model

export const getQuestionsByCollege = async (req, res) => {
  const { collegeId } = req.params;
  

  if (!collegeId) {
    return res.status(400).json({ message: 'College ID is required' });
  }

  console.log(collegeId);

  try {

    const questions = await Answer.find({ collegeId: collegeId.trim()});

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this college' });
    }

   
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching questions and answers' });
  }
};

export const addQuestion = async (req, res) => {
  const { collegeId, user, question } = req.body;

  if (!collegeId || !user || !question) {
    return res.status(400).json({ message: 'collegeId, user, and question are required' });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(collegeId.trim());

    const newQuestionItem = {
      question,
      user,
      createdAt: new Date(),
    };

    // Try to find the document for this college
    let qaDoc = await Answer.findOne({ collegeId: objectId });

    if (qaDoc) {
      // Append the new question
      qaDoc.questions.push(newQuestionItem);
      await qaDoc.save();
    } else {
      // Create new document for this college
      qaDoc = new Answer({
        collegeId: objectId,
        questions: [newQuestionItem]
      });
      await qaDoc.save();
    }

    res.status(201).json({ message: 'Question added successfully', data: qaDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding question' });
  }
};