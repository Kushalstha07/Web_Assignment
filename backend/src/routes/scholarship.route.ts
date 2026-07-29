import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { ScholarshipController } from "../controllers/scholarship.controller";
import { ScholarshipApplicationController } from "../controllers/scholarship-application.controller";

const router = Router();
const controller = new ScholarshipController();
const applicationController = new ScholarshipApplicationController();

router.get("/", controller.getAll.bind(controller));
router.get("/applications", authenticate, applicationController.list.bind(applicationController));
router.patch("/applications/:id", authenticate, authorize("admin"), applicationController.update.bind(applicationController));
router.get("/:id", controller.getById.bind(controller));
router.post("/", authenticate, authorize("admin"), controller.create.bind(controller));
router.post("/:id/apply", authenticate, authorize("student"), applicationController.apply.bind(applicationController));
router.patch("/:id", authenticate, authorize("admin"), controller.update.bind(controller));
router.delete("/:id", authenticate, authorize("admin"), controller.delete.bind(controller));

export default router;
