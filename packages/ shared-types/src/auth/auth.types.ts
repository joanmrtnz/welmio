export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  mobileNumber?: string;
  dateOfBirth?: string;
  password: string;
}

export interface AuthResponseUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  accessToken: string;
  user: AuthResponseUser;
}

export type AuthMeResponse = {
  valid: boolean;
  user: {
    id: string;
    email: string;
    fullName?: string | null;
    mobileNumber?: string | null;
    dateOfBirth?: string | null;
  }
}

export type AuthTokensResponse = {
  accessToken: string;
  refreshToken: string;
}