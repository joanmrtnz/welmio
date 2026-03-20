export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
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