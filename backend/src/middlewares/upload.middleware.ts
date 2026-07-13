import multer from "multer";
import fs from "fs";
import path from "path";
import {
  DOCUMENT_UPLOAD_DIRECTORY,
  PROFILE_UPLOAD_DIRECTORY,
} from "../configs/storage";

fs.mkdirSync(PROFILE_UPLOAD_DIRECTORY, { recursive: true });
fs.mkdirSync(DOCUMENT_UPLOAD_DIRECTORY, { recursive: true });

const profileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PROFILE_UPLOAD_DIRECTORY);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, GIF and WebP images are allowed."));
  }
};

export const upload = multer({
  storage: profileStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const documentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, DOCUMENT_UPLOAD_DIRECTORY);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `document-${uniqueSuffix}${ext}`);
  },
});

const documentFileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only PDF, DOC, DOCX, TXT, JPEG, PNG and WebP documents are allowed."));
};

export const documentUpload = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
