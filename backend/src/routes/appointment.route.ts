import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { AppointmentController } from "../controllers/appointment.controller";

const router = Router();
const controller = new AppointmentController();

router.post("/", authenticate, controller.create.bind(controller));
router.get("/", authenticate, controller.getMyAppointments.bind(controller));
router.get("/all", authenticate, controller.getAll.bind(controller));
router.get("/date-range", authenticate, controller.getByDateRange.bind(controller));
router.get("/counsellor/:counsellorId", authenticate, controller.getByCounsellor.bind(controller));
router.get("/:id", authenticate, controller.getById.bind(controller));
router.patch("/:id", authenticate, controller.update.bind(controller));
router.post("/:id/cancel", authenticate, controller.cancel.bind(controller));

export default router;