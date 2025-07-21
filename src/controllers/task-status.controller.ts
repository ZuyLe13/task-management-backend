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
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color, isActive, isDefault } = req.body;
    const taskStatus = await TaskStatusModel.findById(id);
    if (!taskStatus) {
      res.status(404).json({ error: "Task status not found" });
      return;
    }

    if (taskStatus.isDefault) {
      res.status(400).json({ error: "Cannot modify default status" });
      return;
    }

    if (name) {
      const newCode = generateCode(name);
      const existingStatus = await TaskStatusModel.findOne({ code: newCode, _id: { $ne: id } });
      if (existingStatus) {
        res.status(400).json({ error: `Task status with code '${newCode}' already exists` });
        return;
      }
      taskStatus.name = name;
      taskStatus.code = newCode;
    }
    if (color) taskStatus.color = color;
    if (isActive !== undefined) taskStatus.isActive = isActive;
    if (isDefault !== undefined) taskStatus.isDefault = isDefault;

    await taskStatus.save();
    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: taskStatus
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}