import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { ScholarshipController } from "../controllers/scholarship.controller";

const router = Router();
const controller = new ScholarshipController();

router.get("/", controller.getAll.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", authenticate, authorize("admin"), controller.create.bind(controller));
router.patch("/:id", authenticate, authorize("admin"), controller.update.bind(controller));
router.delete("/:id", authenticate, authorize("admin"), controller.delete.bind(controller));

export default router;
