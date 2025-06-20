import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      id: await UserModel.countDocuments() + 1,
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Password is incorrect' });
      return;
    }

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email },
      config.jwtSecret,
      { expiresIn: '10m' }
    );

    const refreshToken = jwt.sign(
      { _id: user._id, email: user.email },
      config.jwtRefreshSecret,
      { expiresIn: '7d' }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};

export const signOut = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  
  res.status(200).json({ message: 'Signed out successfully' });
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401).json({ message: 'Refresh token is required' });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtRefreshSecret) as { id: number; email: string };
    const newAccessToken = jwt.sign(
      { id: payload.id, email: payload.email },
      config.jwtSecret,
      { expiresIn: '10m' }
    );
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
    return;
  }
}
