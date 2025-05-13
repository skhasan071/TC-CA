import express from 'express';
import Cost from '../models/cost.js';

const router = express.Router();

export const getCostDetails = async (req, res) => {
    const { collegeId } = req.params;
  
    if (!collegeId) {
      return res.status(400).json({ message: 'College ID is required' });
    }
  
    try {
      const costDetails = await Cost.findOne({ collegeId: collegeId.trim() });
  
      if (!costDetails) {
        return res.status(404).json({ message: 'College details not found' });
      }
  
      res.status(200).json({
        costDetails
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching college details', error: error.message });
    }
  };