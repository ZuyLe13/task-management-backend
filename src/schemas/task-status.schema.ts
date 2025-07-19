import Joi from "joi";
import TaskStatusModel from "../models/task-status.model";

export const defaultStatuses = [
  { name: "To Do", code: "TODO", color: "#FF0000", active: true, default: true },
  { name: "In Process", code: "INPROGRESS", color: "#FFA500", active: true, default: true },
  { name: "Done", code: "DONE", color: "#00FF00", active: true, default: true },
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

// Validation schemas
export const taskStatusSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  code: Joi.string().min(2).max(20).required(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
  active: Joi.boolean().required(),
  default: Joi.boolean().required(),
});

export const updateTaskStatusSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  code: Joi.string().min(2).max(20).optional(),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
  active: Joi.boolean().optional(),
  default: Joi.boolean().optional(),
}).min(1);