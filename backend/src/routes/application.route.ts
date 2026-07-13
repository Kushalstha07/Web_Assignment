import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { ApplicationController } from "../controllers/application.controller";

const router = Router();
const controller = new ApplicationController();

router.post("/", authenticate, controller.create.bind(controller));
router.get("/", authenticate, controller.getMyApplications.bind(controller));
router.get("/all", authenticate, authorize("admin"), controller.getAll.bind(controller));
router.get("/assigned", authenticate, authorize("counsellor"), controller.getAssigned.bind(controller));
router.get("/:id", authenticate, controller.getById.bind(controller));
router.patch("/:id", authenticate, controller.update.bind(controller));
router.post("/:id/submit", authenticate, controller.submit.bind(controller));
router.delete("/:id", authenticate, controller.delete.bind(controller));

export default router;
