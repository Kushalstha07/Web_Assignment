export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface SafeUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  studyLevel?: string;
  destination?: string;
  fieldOfStudy?: string;
  intake?: string;
  budget?: string;
  role: string;
  profileImage: string | null;
}

export interface AdminUser extends SafeUser {
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  user: SafeUser;
  token: string;
}

export interface AdminCreateUserPayload {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  studyLevel?: string;
  destination?: string;
  fieldOfStudy?: string;
  intake?: string;
  budget?: string;
  password: string;
  role?: "admin" | "counsellor" | "student";
}

export interface AdminUpdateUserPayload {
  fullName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  studyLevel?: string;
  destination?: string;
  fieldOfStudy?: string;
  intake?: string;
  budget?: string;
  password?: string;
  role?: "admin" | "counsellor" | "student";
}
