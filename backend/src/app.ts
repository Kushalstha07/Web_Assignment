import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import userRoutes from "./routes/user.route";
import adminRoutes from "./routes/admin.route";
import academicProfileRoutes from "./routes/academic-profile.route";

const app: Application = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Edu Global API is running",
  });
});

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/academic-profile", academicProfileRoutes);

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