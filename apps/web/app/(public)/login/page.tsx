import { AuthCard } from "@repo/ui/components/auth/auth-card";
import { LoginForm } from "./login-form";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <AuthCard>
        <LoginForm />
      </AuthCard>
    </main>
  );
}
