import Joi from 'joi';

export const taskTypeValidationSchema = Joi.object({
  name: Joi.string().trim().required().min(2).max(100).messages({
    'string.empty': 'Task type name is required',
    'any.required': 'Task type name is required',
    'string.min': 'Task type name must be at least 2 character long',
    'string.max': 'Task type name must not exceed 100 characters'
  }),
  code: Joi.string().trim().optional().min(2).max(100).uppercase().pattern(/^[A-Z_]+$/).messages({
    'string.min': 'Task type code must be at least 2 character long',
    'string.max': 'Task type code must not exceed 100 characters',
  }),
  icon: Joi.string().trim().optional().allow('').messages({
    'string.base': 'Icon must be a string'
  }),
  isActive: Joi.boolean().default(true).messages({
    'boolean.base': 'isActive must be a boolean'
  }),
  isSubTask: Joi.boolean().default(false).messages({
    'boolean.base': 'isSubTask must be a boolean'
  })
});