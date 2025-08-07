import { Request, Response } from 'express';
import PriorityModel from '../models/priority.model';
import { generateCode } from '../schemas/task-status.schema';

export const getAllPriorities = async (req: Request, res: Response) => {
  try {
    const priorities = await PriorityModel.find().sort({ level: 1 });
    res.json(priorities);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const getPriorityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const priority = await PriorityModel.findById(id);
    
    if (!priority) {
      res.status(404).json({
        success: false,
        message: 'Priority not found'
      });
      return;
    }

    res.json({
      success: true,
      data: priority
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const createPriority = async (req: Request, res: Response) => {
  try {
    const { name, level, color, isActive = true, isDefault = false } = req.body;
    const code = generateCode(name);

    // Check if code already exists
    const existingPriority = await PriorityModel.findOne({ code });
    if (existingPriority) {
      res.status(400).json({
        success: false,
        message: `Priority with code already exists`
      });
      return;
    }

    // Check if level already exists
    const existingLevel = await PriorityModel.findOne({ level });
    if (existingLevel) {
      res.status(400).json({
        success: false,
        message: `Priority with level already exists`
      });
      return;
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await PriorityModel.updateMany({}, { isDefault: false });
    }

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
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const updatePriority = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, level, color, isActive, isDefault } = req.body;

    const existingPriority = await PriorityModel.findById(id);
    if (!existingPriority) {
      res.status(404).json({
        success: false,
        message: 'Priority not found'
      });
      return;
    }

    // Check if new code conflicts with existing priorities
    if (name) {
      const newCode = generateCode(name);
      const codeConflict = await PriorityModel.findOne({ 
        code: newCode, 
        _id: { $ne: id } 
      });
      if (codeConflict) {
        res.status(400).json({
          success: false,
          message: `Priority with code '${newCode}' already exists`
        });
        return;
      }
      existingPriority.name = name;
      existingPriority.code = newCode;
    }

    // Check if new level conflicts with existing priorities
    if (level !== undefined) {
      const levelConflict = await PriorityModel.findOne({ 
        level, 
        _id: { $ne: id } 
      });
      if (levelConflict) {
        res.status(400).json({
          success: false,
          message: `Priority with level '${level}' already exists`
        });
        return;
      }
      existingPriority.level = level;
    }

    if (color) existingPriority.color = color;
    if (isActive !== undefined) existingPriority.isActive = isActive;
    
    // If setting as default, unset other defaults
    if (isDefault !== undefined) {
      if (isDefault) {
        await PriorityModel.updateMany({ _id: { $ne: id } }, { isDefault: false });
      }
      existingPriority.isDefault = isDefault;
    }

    const updatedPriority = await existingPriority.save();

    res.status(200).json({
      success: true,
      message: 'Priority updated successfully',
      data: updatedPriority
    });
  } catch (error) {
    console.error('Error in updatePriority:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const deletePriority = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const priority = await PriorityModel.findById(id);

    if (!priority) {
      res.status(404).json({
        success: false,
        message: 'Priority not found'
      });
      return;
    }

    await priority.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Priority deleted successfully'
    });
  } catch (error) {
    console.error('Error in deletePriority:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const getActivePriorities = async (req: Request, res: Response) => {
  try {
    const priorities = await PriorityModel.find({ isActive: true }).sort({ level: 1 });
    res.json({
      success: true,
      data: priorities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const getDefaultPriority = async (req: Request, res: Response) => {
  try {
    const defaultPriority = await PriorityModel.findOne({ isDefault: true, isActive: true });
    
    if (!defaultPriority) {
      res.status(404).json({
        success: false,
        message: 'No default priority found'
      });
      return;
    }

    res.json({
      success: true,
      data: defaultPriority
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
