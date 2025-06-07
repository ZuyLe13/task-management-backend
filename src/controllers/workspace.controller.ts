import { Request, Response } from 'express';
import WorkspaceModel, { Workspace } from '../models/workspace.model';

export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user?._id;
    console.log('🚀 ~ createWorkspace ~ userId:', userId)

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const newWorkspace = new WorkspaceModel({
      name,
      owner: userId
    });

    await newWorkspace.save();
    res.status(201).json({
        message: 'Workspace created successfully',
        newWorkspace
      });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}