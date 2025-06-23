import { Request, Response } from 'express';
import UserModel from '../models/user.model';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(400).json({ message: 'User ID not found in token' });
      return;
    }

    const user = await UserModel.findOne({ _id: userId }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(400).json({ message: 'User ID not found in token' });
      return;
    }
    const { fullName, email, firstName, lastName, phone, role } = req.body;
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { fullName, email, firstName, lastName, phone, role },
      { new: true, runValidators: true, select: '-password' }
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}