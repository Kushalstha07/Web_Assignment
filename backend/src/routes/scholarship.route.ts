import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { ScholarshipController } from "../controllers/scholarship.controller";

const router = Router();
const controller = new ScholarshipController();

router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", authenticate, controller.create.bind(controller));
router.patch("/:id", authenticate, controller.update.bind(controller));
router.delete("/:id", authenticate, controller.delete.bind(controller));

export default router;