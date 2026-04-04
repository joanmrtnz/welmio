export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}