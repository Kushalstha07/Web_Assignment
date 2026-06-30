import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const adminRouter = Router();
const adminController = new AdminController();

// All admin routes require authentication + admin role
adminRouter.use(authenticate, authorize("admin"));

// GET /api/v1/admin/users -> Paginated User data
adminRouter.get("/users", adminController.listUsers);

// GET /api/v1/admin/users/:id -> View one User data
adminRouter.get("/users/:id", adminController.getUser);

// POST /api/v1/admin/users -> Create a User data
adminRouter.post("/users", adminController.createUser);

// PUT /api/v1/admin/users/:id -> Update a selected User data
adminRouter.put("/users/:id", adminController.updateUser);

// PATCH /api/v1/admin/users/:id -> Update a selected User data
adminRouter.patch("/users/:id", adminController.updateUser);

// DELETE /api/v1/admin/users/:id -> Delete a selected User data
adminRouter.delete("/users/:id", adminController.deleteUser);

export default adminRouter;