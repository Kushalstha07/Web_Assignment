import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.route";
import adminRoutes from "./routes/admin.route";
import academicProfileRoutes from "./routes/academic-profile.route";
import universityRoutes from "./routes/university.route";
import applicationRoutes from "./routes/application.route";
import documentRoutes from "./routes/document.route";
import counsellorRoutes from "./routes/counsellor.route";
import appointmentRoutes from "./routes/appointment.route";
import messageRoutes from "./routes/message.route";
import scholarshipRoutes from "./routes/scholarship.route";
import notificationRoutes from "./routes/notification.route";
import analyticsRoutes from "./routes/analytics.route";
import visaRoutes from "./routes/visa.route";
import aiRoutes from "./routes/ai.route";
import { CORS_ORIGINS } from "./configs/constant";
import { securityHeaders } from "./middlewares/security.middleware";
import { PROFILE_UPLOAD_DIRECTORY } from "./configs/storage";

const app: Application = express();

app.disable("x-powered-by");
app.use(securityHeaders);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || CORS_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      // Omit CORS headers for untrusted browser origins.
      callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(PROFILE_UPLOAD_DIRECTORY));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Edu Global API is running",
  });
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/academic-profile", academicProfileRoutes);
app.use("/api/v1/universities", universityRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/documents", documentRoutes);
app.use("/api/v1/counsellors", counsellorRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/scholarships", scholarshipRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/visa", visaRoutes);
app.use("/api/v1/ai", aiRoutes);

app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err.message);

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

export default app;
