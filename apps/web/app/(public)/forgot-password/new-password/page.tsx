import { AuthCard } from "@repo/ui/components/auth/auth-card";
import { NewPasswordForm } from "./new-password-form";
import { AuthPageLayout } from "@repo/ui/components/layout/auth-page-layout";

export default function NewPasswordPage() {
  return (
    <AuthPageLayout title="New Password">
      <AuthCard>
        <NewPasswordForm />
      </AuthCard>
    </AuthPageLayout>
  );
}
