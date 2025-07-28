import Joi from "joi";
import TaskStatusModel from "../models/task-status.model";

export const defaultStatuses = [
  { name: "To Do", code: "TO_DO", color: "#cccccc", isActive: true, isDefault: true },
  { name: "In Process", code: "IN_PROCESS", color: "#007bff", isActive: true, isDefault: false },
  { name: "Done", code: "DONE", color: "#28a745", isActive: true, isDefault: false },
];

export const initializeDefaultStatuses = async () => {
  try {
    for (const status of defaultStatuses) {
      const existingStatus = await TaskStatusModel.findOne({code: status.code});
      if (!existingStatus) {
        await new TaskStatusModel(status).save();
      }
    }
  } catch (error) {
    console.error("Error initializing default statuses:", error);
  }
}

export const generateCode = (name: string): string => {
  return name.toUpperCase().replace(/\s+/g, '_').slice(0, 20);
};

// Validation schemas
export const taskStatusSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  code: Joi.string().pattern(/^[A-Z]+(_[A-Z]+)*$/).min(2).max(20).optional(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
  isActive: Joi.boolean().required(),
  isDefault: Joi.boolean().required(),
});

export const updateTaskStatusSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  code: Joi.string().pattern(/^[A-Z]+(_[A-Z]+)*$/).min(2).max(20).optional(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
  isActive: Joi.boolean().optional(),
  isDefault: Joi.boolean().optional(),
}).min(1);