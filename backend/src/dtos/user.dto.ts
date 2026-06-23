import { z } from "zod";
import { UserSchema, studyLevels, destinations, intakes, budgets } from "../types/user.type";

export const CreateUserDTO = UserSchema.pick({
  fullName: true,
  username: true,
  email: true,
  phoneNumber: true,
  studyLevel: true,
  destination: true,
  fieldOfStudy: true,
  intake: true,
  budget: true,
  password: true,
});

export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = UserSchema.pick({
  email: true,
  password: true,
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

export const UpdateUserDTO = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .optional(),
  studyLevel: z.enum(studyLevels).optional(),
  destination: z.enum(destinations).optional(),
  fieldOfStudy: z.string().min(1, "Field of study is required").optional(),
  intake: z.enum(intakes).optional(),
  budget: z.enum(budgets).optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

export const ChangePasswordDTO = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordDTO = z.infer<typeof ChangePasswordDTO>;
