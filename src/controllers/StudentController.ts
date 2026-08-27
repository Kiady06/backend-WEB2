import { Request, Response, NextFunction } from "express";
import { StudentService } from "../services/StudentService";
import { parseId } from "./utils";

const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const students = await StudentService.list();
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const student = await StudentService.create(name, email, password);
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }
    const student = await StudentService.update(id, req.body);
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

const disable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }
    const student = await StudentService.disable(id);
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

export const StudentController = {
  list,
  create,
  update,
  disable,
};