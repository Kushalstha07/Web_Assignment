import { Router } from "express";
import { UniversityController } from "../controllers/university.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();
const controller = new UniversityController();

router.get("/", (req, res) => controller.getAllPaginated(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.get("/country/:country", (req, res) => controller.getByCountry(req, res));
router.post("/", authenticate, authorize("admin"), (req, res) => controller.create(req, res));
router.put("/:id", authenticate, authorize("admin"), (req, res) => controller.update(req, res));
router.delete("/:id", authenticate, authorize("admin"), (req, res) => controller.delete(req, res));

export default router;
