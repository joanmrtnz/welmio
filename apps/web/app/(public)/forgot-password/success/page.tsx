import { SuccessMessage } from "@repo/ui/components/feedback/success-message/success-message";

export default function ForgotPasswordSuccessPage() {
  return (
    <SuccessMessage
      title="Password has been changed successfully"
      autoRedirectTo="/login"
    />
  );
}
