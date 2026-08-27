import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenExpiredError, TokenInvalidError } from "../security/jwt";
import { UserRepository } from "../repositories/UserRepository";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Invalid token format" });
    return;
  }

  try {
    const payload = verifyToken(token);

    const user = await UserRepository.findById(payload.id);
    if (!user || !user.isActive) {
      res.status(403).json({ message: "This account has been disabled" });
      return;
    }

    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ message: "Token has expired" });
      return;
    }
    if (err instanceof TokenInvalidError) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    next(err);
  }
};