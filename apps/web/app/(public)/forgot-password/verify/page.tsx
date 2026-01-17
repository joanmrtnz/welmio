import { AuthCard } from "@repo/ui/components/auth/auth-card";
import { VerifyForm } from "./verify-form";
import { AuthPageLayout } from "@repo/ui/components/layout/auth-page-layout";

export default function VerifyPage() {
  return (
    <AuthPageLayout title="Recovery Code">
      <AuthCard>
        <VerifyForm />
      </AuthCard>
    </AuthPageLayout>
  );
}
