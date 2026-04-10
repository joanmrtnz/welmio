export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber?: string | null;
  dateOfBirth?: Date | null;
  password: string;
  role: UserRole;
  resetPasswordCode?: string | null;
  resetPasswordCodeExpiry?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}