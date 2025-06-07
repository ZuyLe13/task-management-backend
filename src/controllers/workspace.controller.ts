import { Request, Response } from 'express';
import WorkspaceModel, { Workspace } from '../models/workspace.model';

export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const userId = req.user?._id;
    const imageUrl = req.file?.path;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const newWorkspace = new WorkspaceModel({
      title,
      owner: userId,
      imageUrl
    });

    await newWorkspace.save();
    res.status(201).json({ message: 'Workspace created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
