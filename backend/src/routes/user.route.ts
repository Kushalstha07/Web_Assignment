import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", userController.createUser);
userRouter.post("/login", userController.loginUser);

// Logout endpoint - clears the httpOnly token cookie
userRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
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