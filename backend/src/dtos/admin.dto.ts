import { z } from "zod";
import { StudentProfileSchema, studyLevels, destinations, intakes, budgets } from "../types/user.type";

const AdminBaseCreateUserDTO = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  studyLevel: z.enum(studyLevels).optional(),
  destination: z.enum(destinations).optional(),
  fieldOfStudy: z.string().min(1, "Field of study is required").optional(),
  intake: z.enum(intakes).optional(),
  budget: z.enum(budgets).optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "counsellor", "student"]).optional().default("student"),
});

export const AdminCreateUserDTO = AdminBaseCreateUserDTO.superRefine((data, ctx) => {
  if (data.role !== "student") return;
  const result = StudentProfileSchema.safeParse(data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      ctx.addIssue({
        code: "custom",
        path: issue.path,
        message: issue.message,
      });
    }
  }
});

export type AdminCreateUserDTO = z.infer<typeof AdminCreateUserDTO>;

export const AdminUpdateUserDTO = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
  username: z.string().min(1, "Username is required").optional(),
  email: z.string().email("Invalid email").optional(),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  studyLevel: z.enum(studyLevels).optional(),
  destination: z.enum(destinations).optional(),
  fieldOfStudy: z.string().min(1, "Field of study is required").optional(),
  intake: z.enum(intakes).optional(),
  budget: z.enum(budgets).optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["admin", "counsellor", "student"]).optional(),
});

export type AdminUpdateUserDTO = z.infer<typeof AdminUpdateUserDTO>;
