import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user || !user.role) {
    return res.status(403).json({ message: "Access restricted to administrators" });
  }
  next();
}

export function requireStudent(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user || user.role !== "student") {
    return res.status(403).json({ message: "Access restricted to students" });
  }
  next();
}