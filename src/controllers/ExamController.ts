import { Request, Response, NextFunction } from "express";
import { ExamService } from "../services/examService";
import { resultService } from "../services/ResultService";

export const ExamController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const exams = await ExamService.getAll();
      res.status(200).json(exams);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const exam = await ExamService.getById(id);
      res.status(200).json(exam);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { course_id, name, desc, start_date, end_date } = req.body;
      const exam = await ExamService.create(course_id, name, desc, start_date, end_date);
      res.status(201).json(exam);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { name, desc, start_date, end_date } = req.body;
      const exam = await ExamService.update(id, name, desc, start_date, end_date);
      res.status(200).json(exam);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await ExamService.remove(id);
      res.status(200).json({ message: "Exam deleted" });
    } catch (err) {
      next(err);
    }
  },

  async getResults(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const results = await resultService.getResultsForExam(id);
      res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  },
};
