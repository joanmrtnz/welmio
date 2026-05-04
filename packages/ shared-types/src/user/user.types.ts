import { IconName } from "../ui";

export type UpdateUserProfilePayload = {
  fullName?: string;
  mobileNumber?: string | null;
  avatarIcon?: IconName;
  avatarColor?: string | null;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type DeleteAccountPayload = {
  confirmationText: string;
};

export type DeleteAccountResponse = {
  id: string;
  deleted: boolean;
  message: string;
};