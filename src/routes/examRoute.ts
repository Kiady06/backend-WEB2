import {Router} from "express";
import { MyExamController } from "../controllers/MyExamController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAdmin, requireStudent } from "../middlewares/roleMiddleware";
import { ExamController } from "../controllers/ExamController";
import { QuestionController } from "../controllers/QuestionController";
import { validate } from "../middlewares/validate";
import { createQuestionSchema } from "../models/QuestionSchemas";


const router= Router();

router.use(authMiddleware);

// for students
router.get("/my/exams", requireStudent, MyExamController.getAvailableExams);
router.get("/my/exams/:id", requireStudent, MyExamController.getExamToTake);
router.post("/my/exams/:id/submit", requireStudent, MyExamController.submitExam);
router.get("/my/results", requireStudent, MyExamController.getMyResults);

// for admins
router.get("/exams",requireAdmin,ExamController.getAll);
router.post("/exams",requireAdmin,ExamController.create);
router.get("/exams/:id",requireAdmin,ExamController.getById);
router.put("/exams/:id",requireAdmin,ExamController.update);
router.delete("/exams/:id",requireAdmin,ExamController.remove);

router.get("/exams/:id/questions",requireAdmin,QuestionController.listForExam);
router.post("/exams/:id/questions", requireAdmin, validate(createQuestionSchema), QuestionController.create);

router.get("/exams/:id/results", ExamController.getResults);

export default router;
