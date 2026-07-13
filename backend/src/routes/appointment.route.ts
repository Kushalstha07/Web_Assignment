import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { AppointmentController } from "../controllers/appointment.controller";

const router = Router();
const controller = new AppointmentController();

router.post("/", authenticate, authorize("student"), controller.create.bind(controller));
router.get("/", authenticate, controller.getMyAppointments.bind(controller));
router.get("/all", authenticate, authorize("admin"), controller.getAll.bind(controller));
router.get("/date-range", authenticate, authorize("admin"), controller.getByDateRange.bind(controller));
router.get("/counsellor/:counsellorId", authenticate, authorize("admin"), controller.getByCounsellor.bind(controller));
router.get("/:id", authenticate, controller.getById.bind(controller));
router.patch("/:id", authenticate, controller.update.bind(controller));
router.post("/:id/cancel", authenticate, controller.cancel.bind(controller));

export default router;
