import { Router } from "express";
import { AiController } from "../controllers/ai.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();
const controller = new AiController();

router.post("/chat", authenticate, controller.chat.bind(controller));
router.post("/scholarship-advice", authenticate, authorize("student"), controller.scholarshipAdvice.bind(controller));

export default router;
