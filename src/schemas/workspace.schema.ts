import Joi from "joi";

const RoleEnum = Joi.string().valid('admin', 'owner', 'member').required();

export const WorkspaceMemberSchema = Joi.object({
  user: Joi.string().pattern(/^[a-f\d]{24}$/i).required().messages({
    'string.pattern.base': 'Invalid ObjectId',
  }),
  role: RoleEnum,
  joinedAt: Joi.date().required(),
});

export const WorkspaceSchema = Joi.object({
  title: Joi.string().min(1).required().messages({
    'string.empty': 'Name is required',
  }),
  desc: Joi.string().optional().allow(''),
  owner: Joi.string().optional().allow(''),
  imageUrl: Joi.string().optional().allow(''),
  members: Joi.array().items(WorkspaceMemberSchema).optional(),
});