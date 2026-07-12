import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { CounsellorController } from "../controllers/counsellor.controller";

const router = Router();
const controller = new CounsellorController();

router.post("/", authenticate, controller.create.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.get("/paginated", authenticate, controller.getAllPaginated.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.patch("/:id", authenticate, controller.update.bind(controller));
router.delete("/:id", authenticate, controller.delete.bind(controller));

export default router;