export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export interface SafeUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  studyLevel: string;
  destination: string;
  fieldOfStudy: string;
  intake: string;
  budget: string;
  role: string;
  profileImage: string | null;
}

export interface LoginResponse {
  user: SafeUser;
  token: string;
}
