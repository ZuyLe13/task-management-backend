import { Response, Request } from 'express';
import TaskTypeModel from '../models/task-type.model';
import { generateCode } from '../schemas/task-status.schema';

export const getAllTaskType = async (req: Request, res: Response) => {
  try {
    const taskTypes = await TaskTypeModel.find();
    res.json(taskTypes);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    }); return;
  }
}

export const createTaskType = async (req: Request, res: Response) => {
  try {
    const { name, icon, isActive, isSubTask = false } = req.body;
    const code = generateCode(name);

    const existingTaskType = await TaskTypeModel.findOne({ code });
    if (existingTaskType) {
      res.status(400).json({
        success: false,
        message: 'Task type with this code already exists'
      }); return;
    }

    const newTaskType = new TaskTypeModel({
      name, code, icon, isActive, isSubTask
    });

    const savedTaskType = await newTaskType.save();

    res.status(201).json({
      success: true,
      message: 'Task type created successfully',
      data: savedTaskType
    });
  } catch (error) {
    console.error('Error in createTaskType:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const updateTaskType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, icon, isActive, isSubTask } = req.body;

    const existingTaskType = await TaskTypeModel.findById(id);
    if (!existingTaskType) {
      res.status(404).json({
        success: false,
        message: 'Task type not found'
      }); return;
    }

    if (name && name.trim() !== existingTaskType.name) {
      const newCode = generateCode(name);
      const duplicateTaskType = await TaskTypeModel.findOne({ code: newCode, _id: { $ne: id } });
      if (duplicateTaskType) {
        res.status(400).json({ success: false, message: 'Task type with this code already exists' });
        return;
      }
    }

    // Update task type
    const updatedTaskType = await TaskTypeModel.findByIdAndUpdate(
      id,
      {
        name: name ? name.trim() : existingTaskType.name,
        code: existingTaskType.code,
        icon: icon !== undefined ? icon : existingTaskType.icon,
        isActive: isActive !== undefined ? isActive : existingTaskType.isActive,
        isSubTask: isSubTask !== undefined ? isSubTask : existingTaskType.isSubTask
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task type updated successfully',
      data: updatedTaskType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    }); return;
  }
}

export const deleteTaskType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingTaskType = await TaskTypeModel.findById(id);
    if (!existingTaskType) {
      res.status(404).json({
        success: false,
        message: 'Task type not found'
      }); return;
    }

    // TODO: Check if task type is being used by any tasks before deleting
    // const tasksUsingThisType = await TaskModel.find({ taskType: id });
    // if (tasksUsingThisType.length > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Cannot delete task type that is being used by tasks'
    //   });
    // }

    // Delete task type
    await TaskTypeModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Task type deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    }); return;
  }
}