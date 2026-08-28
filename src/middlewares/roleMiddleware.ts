import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Access restricted to administrators" });
  }
  next();
}

export function requireStudent(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  if (!user || user.isAdmin) {
    return res.status(403).json({ message: "Access restricted to students" });
  }
  next();
}