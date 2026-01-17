import { AuthCard } from "@repo/ui/components/auth/auth-card";
import { SignUpForm } from "./signup-form";
import { AuthPageLayout } from "@repo/ui/components/layout/auth-page-layout";

export default function SignUpPage() {
  return (
    <AuthPageLayout title="Create Account">
      <AuthCard>
        <SignUpForm />
      </AuthCard>
    </AuthPageLayout>
  );
}
