import { Request, Response } from 'express';
import { users, User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export const signUp = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    res.status(400).json({ message: 'Email already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: users.length + 1,
    fullName,
    email,
    password: hashedPassword,
  };

  users.push(newUser);
  res.status(201).json({ message: 'User created successfully' });
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email);
  if (!user) {
    res.status(400).json({ message: 'Invalid credentials' }); 
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({ message: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.status(200).json({ token });
};
