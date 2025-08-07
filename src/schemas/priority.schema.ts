import Joi from "joi";

// Validation schemas
export const prioritySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Priority name is required',
    'any.required': 'Priority name is required',
    'string.min': 'Priority name must be at least 2 characters long',
    'string.max': 'Priority name must not exceed 50 characters'
  }),
  code: Joi.string().pattern(/^[A-Z]+(_[A-Z]+)*$/).min(2).max(20).optional().messages({
    'string.pattern.base': 'Code must contain only uppercase letters and underscores',
    'string.min': 'Code must be at least 2 characters long',
    'string.max': 'Code must not exceed 20 characters'
  }),
  level: Joi.number().integer().min(1).max(10).required().messages({
    'number.base': 'Level must be a number',
    'number.integer': 'Level must be an integer',
    'number.min': 'Level must be at least 1',
    'number.max': 'Level must not exceed 10',
    'any.required': 'Level is required'
  }),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required().messages({
    'string.pattern.base': 'Color must be a valid hex color code (e.g., #FF0000)',
    'any.required': 'Color is required'
  }),
  isActive: Joi.boolean().required().messages({
    'boolean.base': 'isActive must be a boolean'
  }),
  isDefault: Joi.boolean().required().default(false).messages({
    'boolean.base': 'isDefault must be a boolean'
  }),
});

export const updatePrioritySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional().messages({
    'string.min': 'Priority name must be at least 2 characters long',
    'string.max': 'Priority name must not exceed 50 characters'
  }),
  code: Joi.string().pattern(/^[A-Z]+(_[A-Z]+)*$/).min(2).max(20).optional().messages({
    'string.pattern.base': 'Code must contain only uppercase letters and underscores',
    'string.min': 'Code must be at least 2 characters long',
    'string.max': 'Code must not exceed 20 characters'
  }),
  level: Joi.number().integer().min(1).max(10).optional().messages({
    'number.base': 'Level must be a number',
    'number.integer': 'Level must be an integer',
    'number.min': 'Level must be at least 1',
    'number.max': 'Level must not exceed 10'
  }),
  color: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional().messages({
    'string.pattern.base': 'Color must be a valid hex color code (e.g., #FF0000)'
  }),
  isActive: Joi.boolean().optional().messages({
    'boolean.base': 'isActive must be a boolean'
  }),
  isDefault: Joi.boolean().optional().messages({
    'boolean.base': 'isDefault must be a boolean'
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});
