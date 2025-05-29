import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  UserModel,
  CollegeAuthModel,
  ReviewModel,
  CutoffModel,
  ScholarshipModel,
} from "../models/userModel.js";
import mongoose, { Mongoose } from "mongoose";

//register user api
export const registerUser = async (req, res) => {
  const userModel = new UserModel(req.body);
  userModel.password = await bcrypt.hash(req.body.password, 10);
  try {
    const response = await userModel.save();
    response.password = undefined;
    return res.status(201).json({ message: "success", data: response });
  } catch (err) {
    return res.status(500).json({ message: "error" });
  }
};

//login user api
export const loginUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Auth failed,Invalid username/password" });
    }
    const isPassEqual = await bcrypt.compare(req.body.password, user.password);
    if (!isPassEqual) {
      return res
        .status(401)
        .json({ message: "Auth failed,Invalid username/password" });
    }
    const tokenObject = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {
      expiresIn: "4h",
    });

    return res.status(200).json({ jwtToken, tokenObject });
  } catch (err) {
    return res.status(500).json({ message: "error", err });
  }
};

export const userDetails = async (req, res) => {
  try {
    const { name, location, ranking, averagepackage } = req.body;

    const college = new CollegeModel({
      name,
      location,
      ranking,
      averagepackage,
    });

    await college.save();

    return res
      .status(201)
      .json({ message: "College details saved successfully", college });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const registerCollege = async (req, res) => {
  try {
    if (!req.body.collegepassword) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(req.body.collegepassword, 10);
    const collegeAuthModel = new CollegeAuthModel({
      ...req.body,
      collegepassword: hashedPassword,
    });

    const response = await collegeAuthModel.save();
    response.collegepassword = undefined;

    return res.status(201).json({ message: "success", data: response });
  } catch (err) {
    return res.status(500).json({ message: "error", error: err.message });
  }
};

export const loginCollege = async (req, res) => {
  try {
    const college = await CollegeAuthModel.findOne({
      collegeemail: req.body.collegeemail,
    });

    if (!college) {
      return res
        .status(401)
        .json({ message: "Auth failed, Invalid username/password" });
    }

    if (!req.body.collegepassword) {
      return res.status(400).json({ message: "Password is required" });
    }

    const isPassEqual = await bcrypt.compare(
      req.body.collegepassword,
      college.collegepassword
    );

    if (!isPassEqual) {
      return res
        .status(401)
        .json({ message: "Auth failed, Invalid username/password" });
    }

    const tokenObject = {
      _id: college._id,
      collegename: college.collegename,
      collegeemail: college.collegeemail,
    };

    const jwtToken = jwt.sign(tokenObject, process.env.SECRET, {
      expiresIn: "4h",
    });

    return res.status(200).json({ jwtToken, tokenObject });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};


export const reviewdetails = async (req, res) => {
  try {
    const { uid, studentName, studentemail, rating, reviewtext, likes } = req.body;
    const id = new mongoose.Types.ObjectId(uid);
    const review = new ReviewModel({
      uid: id,
      studentName,
      studentemail,
      rating,
      reviewtext,
      likes,
    });

    const savedReview = await review.save();

    res.status(201).json({
      message: "Review Added Successfully",
      review: savedReview,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getReviews = async (req, res) => {
  try{

    const {uid} = req.params;

    const reviews = await ReviewModel.find({uid});

    if(!reviews) return res.status(404).json({err: "No reviews found"});

    res.status(200).json(reviews);

  }catch(err){

    res.status(500).json({err: `Server Error : ${err.message}`});

  }
}

export const cutoffdetails = async (req, res) => {
  try {
    const {
      collegename,
      coursename,
      examname,
      category,
      quota,
      cutoffrank,
      admissionyear,
    } = req.body;
    const review = new CutoffModel({
      collegename,
      coursename,
      examname,
      category,
      quota,
      cutoffrank,
      admissionyear,
    });
    const savedReview = await review.save();
    return res.status(201).json({
      message: "Cutoffs Added Successfully",
      review: savedReview,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const scholarshipdetails = async (req, res) => {
  try {
    const { collegeId, scholarships } = req.body;

    // Basic Validation
    if (!collegeId) {
      return res.status(400).json({ message: "collegeId is required" });
    }

    if (!Array.isArray(scholarships) || scholarships.length === 0) {
      return res.status(400).json({ message: "scholarships must be a non-empty array" });
    }

    // Check if scholarships are missing required fields
    scholarships.forEach((s, index) => {
      if (!s.ScholarshipName || !s.ScholarshipMoney || !s.ScholarshipDescription) {
        return res.status(400).json({
          message: `Scholarship at index ${index} is missing required fields`,
        });
      }
    });

    // Check if a scholarship document already exists for this college
    let scholarshipDoc = await ScholarshipModel.findOne({ collegeId });

    if (!scholarshipDoc) {
      // If no existing scholarship document, create a new one
      scholarshipDoc = new ScholarshipModel({
        collegeId,
        scholarships: scholarships,
      });
    } else {
      // If scholarship document exists, push new scholarships to the array
      scholarshipDoc.scholarships.push(...scholarships);
    }

    // Save the scholarship document
    await scholarshipDoc.save();

    return res.status(201).json({
      message: "Scholarships added successfully",
      data: scholarshipDoc,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};