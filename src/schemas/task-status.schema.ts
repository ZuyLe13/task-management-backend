import Joi from "joi";

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