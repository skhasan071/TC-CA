import express from 'express';
import Cost from '../models/cost.js';

const router = express.Router();
export const addCostDetails = async (req, res) => {
  try {
    const { collegeId, address, costOfLiving, nearbyPlaces } = req.body;

    
    if (!collegeId || !address || !costOfLiving || !nearbyPlaces) {
      return res.status(400).json({ message: 'All fields are required (collegeId, address, costOfLiving, nearbyPlaces)' });
    }

    // Check if a Cost entry already exists for this college
    let existingCost = await Cost.findOne({ collegeId });

    if (existingCost) {
      return res.status(400).json({ message: 'Cost details for this college already exist. Use update API instead.' });
    }

    // Create new Cost entry
    const newCost = new Cost({
      collegeId,
      address,
      costOfLiving,
      nearbyPlaces,
    });

    await newCost.save();

    res.status(201).json({
      message: 'Cost details added successfully',
      data: newCost,
    });
  } catch (error) {
    console.error('Error adding cost details:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const getCostDetails = async (req, res) => {
    const { collegeId } = req.params;
  
    if (!collegeId) {
      return res.status(400).json({ message: 'College ID is required' });
    }
  
    try {
      const costDetails = await Cost.findOne({collegeId});
  
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
  // ✅ Update Cost Details
export const updateCostDetails = async (req, res) => {
  try {
    const { costId } = req.params;
    const { collegeId, address, costOfLiving, nearbyPlaces } = req.body;

    if (!collegeId || !address || !costOfLiving || !nearbyPlaces) {
      return res.status(400).json({ message: 'All fields are required (collegeId, address, costOfLiving, nearbyPlaces)' });
    }

    const updatedCost = await Cost.findByIdAndUpdate(
      costId,
      { collegeId, address, costOfLiving, nearbyPlaces },
      { new: true, runValidators: true }
    );

    if (!updatedCost) {
      return res.status(404).json({ message: 'Cost details not found' });
    }

    res.status(200).json({
      message: 'Cost details updated successfully',
      data: updatedCost,
    });
  } catch (error) {
    console.error('Error updating cost details:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
