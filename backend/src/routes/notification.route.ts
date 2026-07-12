import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { NotificationController } from "../controllers/notification.controller";

const router = Router();
const controller = new NotificationController();

router.get("/", authenticate, controller.getMyNotifications.bind(controller));
router.get("/unread-count", authenticate, controller.getUnreadCount.bind(controller));
router.patch("/read", authenticate, controller.markAsRead.bind(controller));
router.patch("/read-all", authenticate, controller.markAllAsRead.bind(controller));
router.delete("/:id", authenticate, controller.delete.bind(controller));

export default router;