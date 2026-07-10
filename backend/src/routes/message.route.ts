import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { MessageController } from "../controllers/message.controller";

const router = Router();
const controller = new MessageController();

router.post("/conversations", authenticate, controller.createConversation.bind(controller));
router.get("/conversations", authenticate, controller.getMyConversations.bind(controller));
router.get("/conversations/:id", authenticate, controller.getConversationById.bind(controller));
router.post("/send", authenticate, controller.sendMessage.bind(controller));
router.get("/conversations/:conversationId/messages", authenticate, controller.getMessages.bind(controller));
router.patch("/read", authenticate, controller.markAsRead.bind(controller));

export default router;