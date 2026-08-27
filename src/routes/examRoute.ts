import {Router} from "express";
import { MyExamController } from "../controllers/MyExamController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireStudent } from "../middlewares/roleMiddleware";


const router= Router();

router.use(authMiddleware, requireStudent);

router.get("/exams", MyExamController.getAvailableExams);


export default router;