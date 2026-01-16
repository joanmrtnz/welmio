"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@repo/ui/components/auth/auth-input";
import { AuthButton } from "@repo/ui/components/auth/auth-button";
import { TextLink } from "@repo/ui/components/auth/text-link";

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
     
        <AuthButton variant="dark">
          Log In
        </AuthButton>

        <TextLink href="/forgot-password">
          Forgot Password?
        </TextLink>

      <AuthButton variant="light">
          Sign In
        </AuthButton>

    </form>
  );
}
