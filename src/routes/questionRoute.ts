import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController";
import { validate } from "../middlewares/validate";
import { updateQuestionSchema } from "../models/QuestionSchemas";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";

const router = Router();

router.use(authMiddleware, requireAdmin);

router.put("/:id", validate(updateQuestionSchema), QuestionController.update);
router.delete("/:id", QuestionController.remove);

export default router;