import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);

// Protected routes
userRouter.get("/whoami", authenticate, userController.whoami);
userRouter.put(
  "/update",
  authenticate,
  upload.single("profileImage"),
  userController.updateProfile,
);
userRouter.put(
  "/change-password",
  authenticate,
  userController.changePassword,
);

export default userRouter;
