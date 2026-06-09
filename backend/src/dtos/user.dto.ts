import { z } from "zod";
import { UserSchema } from "../types/user.type";

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
