export interface JwtUser {
  sub: string;
  email: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
