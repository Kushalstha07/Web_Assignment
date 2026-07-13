export type AuthFormState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialAuthFormState: AuthFormState = {
  success: false,
};

export type ProfileFormState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export type PasswordFormState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};
