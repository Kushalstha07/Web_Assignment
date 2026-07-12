import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { DocumentController } from "../controllers/document.controller";

const router = Router();
const controller = new DocumentController();

router.post("/upload", authenticate, upload.single("document"), controller.upload.bind(controller));
router.get("/", authenticate, controller.getMyDocuments.bind(controller));
router.get("/all", authenticate, controller.getAll.bind(controller));
router.get("/:id", authenticate, controller.getById.bind(controller));
router.patch("/:id/verify", authenticate, controller.verify.bind(controller));
router.delete("/:id", authenticate, controller.delete.bind(controller));

export default router;