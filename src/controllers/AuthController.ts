import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const AuthController = {
  login,
};