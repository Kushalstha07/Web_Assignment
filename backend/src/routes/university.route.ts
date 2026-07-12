import { Router } from "express";
import { UniversityController } from "../controllers/university.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const controller = new UniversityController();

router.get("/", (req, res) => controller.getAllPaginated(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.get("/country/:country", (req, res) => controller.getByCountry(req, res));
router.post("/", authenticate, (req, res) => controller.create(req, res));
router.put("/:id", authenticate, (req, res) => controller.update(req, res));
router.delete("/:id", authenticate, (req, res) => controller.delete(req, res));

export default router;