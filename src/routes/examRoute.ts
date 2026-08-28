import {Router} from "express";
import { MyExamController } from "../controllers/MyExamController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAdmin, requireStudent } from "../middlewares/roleMiddleware";
import { ExamController } from "../controllers/ExamController";
import { QuestionController } from "../controllers/QuestionController";


const router= Router();

router.use(authMiddleware);

router.get("/my/exams", requireStudent, MyExamController.getAvailableExams);
router.get("/my/exams/:id", requireStudent, MyExamController.getExamToTake);
router.post("/my/exams/:id/submit", requireStudent, MyExamController.submitExam);
router.get("/my/results", requireStudent, MyExamController.getMyResults);

router.get("/exams",requireAdmin,ExamController.getAll);
router.post("/exams",requireAdmin,ExamController.create);
router.get("/exams/:id",requireAdmin,ExamController.getById);
router.put("/exams/:id",requireAdmin,ExamController.update);
router.delete("/exams",requireAdmin,ExamController.remove);

router.get("/exams/:id/questions",requireAdmin,QuestionController.listForExam);
router.post("/exams/:id/questions",QuestionController.create);

router.get("/exams/:id/results", ExamController.getResults);
router.get("/exams", MyExamController.getAvailableExams);
router.get("/exams/:id", MyExamController.getExamToTake);
router.post("/exams/:id/submit", MyExamController.submitExam);
router.get("/results", MyExamController.getMyResults);

export default router;