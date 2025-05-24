import { ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema) => {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(err => err.message);
      return res.status(400).json({ errors });
    }
    req.body = result.data;
    next();
  };
}