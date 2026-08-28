import { Request, Response, NextFunction } from "express";
import { QuestionService } from "../services/QuestionService";

const listForExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const examId = Number(req.params.id);
        if (!Number.isInteger(examId)) {
            return res.status(400).json({ message: "Invalid exam id" });
        }

        const questions = await QuestionService.listForExam(examId);
        res.json(questions);
    } catch (err) {
        next(err);
    }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const examId = Number(req.params.id);
        if (!Number.isInteger(examId)) {
            return res.status(400).json({ message: "Invalid exam id" });
        }

        const question = await QuestionService.create(examId, req.body);
        res.status(201).json(question);
    } catch (err) {
        next(err);
    }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ message: "Invalid question id" });
        }

        const question = await QuestionService.update(id, req.body);
        res.json(question);
    } catch (err) {
        next(err);
    }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({ message: "Invalid question id" });
        }

        await QuestionService.remove(id);
        res.status(200).json({ message: "Question deleted" });
    } catch (err) {
        next(err);
    }
};

export const QuestionController = {
    listForExam,
    create,
    update,
    remove,
};