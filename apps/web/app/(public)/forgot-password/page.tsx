import { AuthCard } from "@repo/ui/components/auth/auth-card";
import { ForgotPasswordForm } from "./forgot-password-form";
import { AuthPageLayout } from "@repo/ui/components/layout/auth-page-layout";

export default function ForgotPasswordPage() {
  return (
    <AuthPageLayout title="Forgot Password">
      <AuthCard>
        <ForgotPasswordForm />
      </AuthCard>
    </AuthPageLayout>
  );
}
