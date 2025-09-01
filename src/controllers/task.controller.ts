import { Response, Request } from 'express';
import TaskModel from '../models/task.model';

async function generateTaskKey(): Promise<string> {
  const lastTask = await TaskModel.findOne().sort({ createdAt: -1 }).exec();
  let nextNumber = 1;
  if (lastTask && lastTask.taskKey) {
    const match = lastTask.taskKey.match(/^ZT-(\d+)$/);
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }
  return `ZT-${nextNumber}`;
}

export const getAllTask = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    }); return;
  }
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const taskKey = await generateTaskKey();
    const newTask = new TaskModel({
      ...req.body,
      taskKey: taskKey
    });
    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: savedTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    }); return;
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTask = await TaskModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTask) {
      res.status(404).json({ success: false, message: 'Task not found' }); return;
    }
    res.json({ success: true, message: 'Task updated successfully', data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskKey } = req.params;
    const deletedTask = await TaskModel.findOneAndDelete({ taskKey });
    if (!deletedTask) {
      res.status(404).json({ success: false, message: 'Task not found' }); return;
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { taskKey } = req.params;
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ success: false, message: 'Status is required' }); return;
    }
    const updatedTask = await TaskModel.findOneAndUpdate(
      { taskKey },
      { status },
      { new: true }
    );
    if (!updatedTask) {
      res.status(404).json({ success: false, message: 'Task not found' }); return;
    }
    res.json({ success: true, message: 'Task status updated', data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};