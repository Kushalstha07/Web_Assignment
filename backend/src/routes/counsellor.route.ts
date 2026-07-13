import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { CounsellorController } from "../controllers/counsellor.controller";

const router = Router();
const controller = new CounsellorController();

router.post("/", authenticate, authorize("admin"), controller.create.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.get("/paginated", authenticate, authorize("admin"), controller.getAllPaginated.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.patch("/:id", authenticate, authorize("admin"), controller.update.bind(controller));
router.delete("/:id", authenticate, authorize("admin"), controller.delete.bind(controller));

export default router;
