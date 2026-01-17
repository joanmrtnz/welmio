import { AuthCard } from "@repo/ui/components/auth/auth-card";
import { LoginForm } from "./login-form";
import styles from "./login.module.css";
import { Typography } from "@repo/ui/components/typography/typography";
import { Section } from "@repo/ui/components/layout/section";

export default function LoginPage() {
  return (
    <main className={styles.container}>

      <Section spacing="x3l">
        <Typography variant="h2">
          Welcome
        </Typography>
      </Section>

      <AuthCard>
        <LoginForm />
      </AuthCard>
    </main>
  );
}
