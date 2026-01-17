"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@repo/ui/components/auth/auth-input";
import { AuthButton } from "@repo/ui/components/auth/auth-button";
import { TextLink } from "@repo/ui/components/auth/text-link";
import { Section } from "@repo/ui/components/layout/section";

import styles from "./login-form.module.css";


export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) return;

    // mock navigation
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Section spacing="x2l">
      
          <AuthInput
            label="Username or Email"
            type="email"
            placeholder="example@email.com"
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="••••••••"
          />
        </Section>

        <Section spacing="lg">
          <AuthButton type="submit" variant="dark">
            Log In
          </AuthButton>

          <TextLink href="/forgot-password">
            Forgot Password?
          </TextLink>

        <AuthButton
          onClick={() => router.push("/signup")}
          variant="light">
            Sign In
          </AuthButton>
        </Section>
    </form>
  );
}
