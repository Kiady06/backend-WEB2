import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validate } from "../middlewares/validate";
import { loginSchema } from "../models/AuthSchemas";

const router = Router();

router.post("/login", validate(loginSchema), AuthController.login);

export default router;