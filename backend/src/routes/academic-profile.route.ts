import { Router } from "express";
import { AcademicProfileController } from "../controllers/academic-profile.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const controller = new AcademicProfileController();

router.get("/", authenticate, (req, res) => controller.getMyProfile(req, res));
router.post("/", authenticate, (req, res) => controller.createProfile(req, res));
router.put("/", authenticate, (req, res) => controller.updateProfile(req, res));
router.put("/step-1", authenticate, (req, res) => controller.saveStep1(req, res));
router.put("/step-2", authenticate, (req, res) => controller.saveStep2(req, res));
router.put("/step-3", authenticate, (req, res) => controller.saveStep3(req, res));

export default router;