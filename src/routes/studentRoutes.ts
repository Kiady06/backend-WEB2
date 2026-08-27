import { Router } from "express";
import { StudentController } from "../controllers/StudentController";
import { validate } from "../middlewares/validate";
import { createStudentSchema, updateStudentSchema } from "../models/StudentSchemas";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";

const router = Router();

router.use(authMiddleware, requireAdmin);

router.get("/", StudentController.list);
router.post("/", validate(createStudentSchema), StudentController.create);
router.put("/:id", validate(updateStudentSchema), StudentController.update);
router.delete("/:id", StudentController.disable);

export default router;