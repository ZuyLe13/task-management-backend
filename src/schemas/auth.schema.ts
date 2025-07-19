import Joi from "joi";

export const signUpSchema = Joi.object({
  fullName: Joi.string().min(1).required().messages({
    'string.empty': 'Full name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
  }),
});

export const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
  }),
});