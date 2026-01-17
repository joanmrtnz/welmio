"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@repo/ui/components/auth/auth-input";
import { AuthButton } from "@repo/ui/components/auth/auth-button";
import { Section } from "@repo/ui/components/layout/section";

import styles from "./new-password-form.module.css";

export function NewPasswordForm() {
  const router = useRouter();

  const [newPassword, setnewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ( !newPassword || !confirmNewPassword || confirmNewPassword !== newPassword) return;
    router.push("/login");
  };


  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Section spacing="x2l" align="left">
      
         <AuthInput
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setnewPassword(e.currentTarget.value)}
          />

          <AuthInput
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.currentTarget.value)}
          />
        </Section>

        <Section spacing="lg">
          <AuthButton type="submit" variant="dark">
            Change Password
          </AuthButton>
        </Section>
    </form>
  );
}
