import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController";
import { validate } from "../middlewares/validate";
import { createQuestionSchema } from "../models/QuestionSchemas";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";

const router = Router();

router.use(authMiddleware, requireAdmin);

router.get("/:id/questions", QuestionController.listForExam);
router.post(
    "/:id/questions",
    validate(createQuestionSchema),
    QuestionController.create
);

export default router;