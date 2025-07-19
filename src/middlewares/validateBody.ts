import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validateBody = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
};