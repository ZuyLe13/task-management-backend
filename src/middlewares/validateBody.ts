import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateBody = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await schema.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false
      });

      req.body = value; // update lại body đã sạch
      next();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
};
