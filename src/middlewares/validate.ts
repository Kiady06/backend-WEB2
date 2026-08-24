import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      res.status(400).json({ message: firstError?.message ?? "Invalid request data" });
      return;
    }

    req.body = result.data;
    next();
  };
};