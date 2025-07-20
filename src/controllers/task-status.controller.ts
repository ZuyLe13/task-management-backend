import { Request, Response } from 'express';
import TaskStatusModel from '../models/task-status.model';
import { generateCode } from '../schemas/task-status.schema';

export const getTaskStatus = async (req: Request, res: Response) => {
  try {
    const taskStatuses = await TaskStatusModel.find();
    res.json(taskStatuses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export const createTaskStatus = async (req: Request, res: Response) => {
  try {
    const { name, color, isActive, isDefault = false } = req.body;
    const code = generateCode(name);
    const existingStatus = await TaskStatusModel.findOne({code});

    if (existingStatus) {
      res.status(400).json({ error: `Task status with code '${code}' already exists` });
      return;
    }

    const newTaskStatus = new TaskStatusModel({
      name, code, color, isActive, isDefault
    });
    await newTaskStatus.save();
    
    res.status(201).json({
      success: true,
      message: 'Task status created successfully',
      data: newTaskStatus
    })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}