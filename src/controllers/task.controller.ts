import { Response, Request } from 'express';
import TaskModel from '../models/task.model';
import taskSchema from '../schemas/task.schema';

async function generateTaskId(): Promise<string> {
  const lastTask = await TaskModel.findOne().sort({ createdAt: -1 }).exec();
  let nextNumber = 1;
  if (lastTask && lastTask.id) {
    const match = lastTask.id.match(/^ZT-(\d+)$/);
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
    const { error, value } = taskSchema.validate(req.body, { abortEarly: false });
    if (error) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      }); return;
    }

    const taskId = await generateTaskId();
    const newTask = new TaskModel({
      ...value,
      id: taskId
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