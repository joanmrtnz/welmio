import { AuthCard } from "@repo/ui/components/auth/auth-card";
import { LoginForm } from "./login-form";
import { AuthPageLayout } from "@repo/ui/components/layout/auth-page-layout";

export default function LoginPage() {
  return (
    <AuthPageLayout title="Welcome">
      <AuthCard>
        <LoginForm />
      </AuthCard>
    </AuthPageLayout>
  );
}
