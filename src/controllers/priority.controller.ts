import { Request, Response } from 'express';
import PriorityModel from '../models/priority.model';
import { generateCode } from '../schemas/task-status.schema';

export const getAllPriorities = async (req: Request, res: Response) => {
  try {
    const priorities = await PriorityModel.find().sort({ level: 1 });
    res.json(priorities);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const getPriorityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const priority = await PriorityModel.findById(id);
    
    if (!priority) {
      res.status(404).json({ success: false, message: 'Priority not found' });
      return;
    }

    res.json({ success: true, data: priority });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const createPriority = async (req: Request, res: Response) => {
  try {
    const { name, level, color, isActive = true, isDefault = false } = req.body;
    const code = generateCode(name);

    const existingPriority = await PriorityModel.findOne({ code });
    if (existingPriority) {
      res.status(400).json({success: false,message: `Priority with code already exists`});
      return;
    }

    // if (isDefault) {
    //   await PriorityModel.updateMany({}, { isDefault: false });
    // }

    const newPriority = new PriorityModel({
      name, code, level, color, isActive, isDefault
    });

    const savedPriority = await newPriority.save();

    res.status(201).json({
      success: true,
      message: 'Priority created successfully',
      data: savedPriority
    });
  } catch (error) {
    console.error('Error in createPriority:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const updatePriority = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, level, color, isActive, isDefault } = req.body;

    const existingPriority = await PriorityModel.findById(id);
    if (!existingPriority) {
      res.status(404).json({ success: false, message: 'Priority not found' });
      return;
    }

    if (name) {
      const newCode = generateCode(name);
      const codeConflict = await PriorityModel.findOne({ code: newCode, _id: { $ne: id } });
      if (codeConflict) {
        res.status(400).json({ success: false, message: `Priority with code '${newCode}' already exists` });
        return;
      }
      existingPriority.name = name;
      existingPriority.code = newCode;
      existingPriority.level = level;
      existingPriority.color = color;
      existingPriority.isActive = isActive;
      existingPriority.isDefault = isDefault;
    }

    const updatedPriority = await existingPriority.save();

    res.status(200).json({
      success: true,
      message: 'Priority updated successfully',
      data: updatedPriority
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const deletePriority = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const priority = await PriorityModel.findById(id);

    if (!priority) {
      res.status(404).json({ success: false, message: 'Priority not found' });
      return;
    }

    await priority.deleteOne();

    res.status(200).json({ success: true, message: 'Priority deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
