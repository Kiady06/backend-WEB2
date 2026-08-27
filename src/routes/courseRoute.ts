import { Router } from "express";
import { CourseController } from "../controllers/CourseController";
import { validate } from "../middlewares/validate";
import { createCourseSchema, updateCourseSchema } from "../models/CourseSchemas";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";
const router = Router();

router.use(authMiddleware, requireAdmin);

router.get("/", CourseController.list);
router.post("/", validate(createCourseSchema),CourseController.create);
router.put("/:id", validate(updateCourseSchema), CourseController.update);
router.delete("/:id", CourseController.remove)

export default router;