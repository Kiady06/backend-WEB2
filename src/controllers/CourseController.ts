import { Request, Response, NextFunction } from "express";
import { CourseService } from "../services/CourseService";
import { parseId } from "./utils";

const list =  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const courses = await CourseService.list();
        res.status(200).json(courses);
    } catch (err){
        next(err);
    }
};

const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { code, name, description } = req.body;
    const student = await CourseService.create(code, name, description);
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
    const student = await CourseService.update(id, req.body);
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }
    const student = await CourseService.remove(id);
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

export const CourseController = {
    list,
    create,
    update,
    remove
}