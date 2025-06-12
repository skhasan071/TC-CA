import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import Student from '../models/studentModel.js';
const client = new OAuth2Client("809028962389-buh0m92ilhd1n27vkuhi1og76g9kb5v2.apps.googleusercontent.com");

export const googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({ message: 'Google tokenId is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: "809028962389-buh0m92ilhd1n27vkuhi1og76g9kb5v2.apps.googleusercontent.com"
    });

    const payload = ticket.getPayload();

    const {email, name} = payload;

    let existingStudent = await Student.findOne({ email });

    const firstTime = false;

    if (!existingStudent) {
      existingStudent = new Student({
        name,
        email,
      })

      await existingStudent.save();
      firstTime = true;
    }

    // Create token
    const token = jwt.sign(
      { userId: existingStudent._id, email: existingStudent.email},
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
        firstTime: firstTime,
      message: "Login successful",
      data: existingStudent,
      token,
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};