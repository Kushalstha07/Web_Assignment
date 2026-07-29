import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { AnalyticsController } from "../controllers/analytics.controller";

const router = Router();
const controller = new AnalyticsController();

router.use(authenticate, authorize("admin"));

router.get("/totals", controller.getTotals.bind(controller));
router.get("/regional", controller.getRegionalDistribution.bind(controller));
router.get("/top-universities", controller.getTopUniversities.bind(controller));
router.get("/monthly-growth", controller.getMonthlyGrowth.bind(controller));
router.get("/success-rate", controller.getSuccessRate.bind(controller));

export default router;
