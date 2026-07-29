import path from "path";

export const PROFILE_UPLOAD_DIRECTORY = path.resolve(
  process.cwd(),
  "public/uploads",
);

export const DOCUMENT_UPLOAD_DIRECTORY = path.resolve(
  process.cwd(),
  "private/uploads/documents",
);
