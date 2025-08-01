import Joi from 'joi';
import { Types } from 'mongoose';


const taskSchema = Joi.object({
  taskKey: Joi.string(),
  title: Joi.string().required().trim().min(1).max(100),
  description: Joi.string().trim().max(1000).optional().allow(''),
  status: Joi.string().required().trim().min(1).max(50),
  assignee: Joi.string().trim().max(100).optional().allow(''),
  reporter: Joi.string().trim().max(100).optional().allow(''),
  startDate: Joi.date().optional().allow(''),
  endDate: Joi.date().optional().min(Joi.ref('startDate')).allow(''),
  label: Joi.array().items(Joi.string().trim().max(50)).optional().allow(''),
  taskType: Joi.string().trim().max(50).optional().allow(''),
  priority: Joi.string().trim().max(50).optional().allow(''),
  comments: Joi.array().items(Joi.string().trim().max(1000)).optional().allow(''),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date())
});

export default taskSchema;