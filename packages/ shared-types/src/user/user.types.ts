export type UpdateUserProfilePayload = {
  fullName?: string;
  mobileNumber?: string | null;
  dateOfBirth?: string | null;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};