import {Router} from "express";
import { MyExamController } from "../controllers/MyExamController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireStudent } from "../middlewares/roleMiddleware";


const router= Router();

router.use(authMiddleware, requireStudent);

router.get("/exams", MyExamController.getAvailableExams);
router.get("/exams/:id", MyExamController.getExamToTake);
router.post("/exams/:id/submit", MyExamController.submitExam);

export default router;