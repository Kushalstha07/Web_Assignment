export type AuthFormState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const initialAuthFormState: AuthFormState = {
  success: false,
};
