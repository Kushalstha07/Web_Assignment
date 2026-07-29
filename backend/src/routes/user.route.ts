import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import { AUTH_COOKIE_OPTIONS } from "../configs/auth";
import { loginRateLimiter, passwordResetRateLimiter } from "../middlewares/rate-limit.middleware";
import { noStore } from "../middlewares/security.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.use(noStore);
userRouter.post("/register", userController.createUser);
userRouter.post("/login", loginRateLimiter, userController.loginUser);
userRouter.post("/forgot-password", passwordResetRateLimiter, userController.forgotPassword);
userRouter.post("/reset-password", passwordResetRateLimiter, userController.resetPassword);

// Logout endpoint - clears the httpOnly token cookie
userRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: undefined,
  });
  return res.json({ success: true, message: "Logged out successfully" });
});

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
