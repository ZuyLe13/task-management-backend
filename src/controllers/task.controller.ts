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
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    }); return;
  }
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const { value } = req.body;
    const taskKey = await generateTaskKey();
    const newTask = new TaskModel({
      ...value,
      taskKey: taskKey
    });
    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: savedTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    }); return;
  }
}