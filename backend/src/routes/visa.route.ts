import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { VisaController } from "../controllers/visa.controller";

const router = Router();
const controller = new VisaController();

router.post("/", authenticate, authorize("student"), controller.create.bind(controller));
router.get("/", authenticate, controller.list.bind(controller));
router.get("/:id", authenticate, controller.getById.bind(controller));
router.patch("/:id", authenticate, authorize("admin", "counsellor"), controller.update.bind(controller));
router.delete("/:id", authenticate, authorize("admin"), controller.delete.bind(controller));

export default router;
