import { Request, Response } from 'express';
import TaskStatusModel from '../models/task-status.model';

export const getTaskStatus = async (req: Request, res: Response) => {
  try {
    const taskStatuses = await TaskStatusModel.find();
    res.json(taskStatuses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}