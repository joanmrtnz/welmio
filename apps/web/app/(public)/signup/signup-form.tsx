"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthInput } from "@repo/ui/components/auth/auth-input";
import { AuthButton } from "@repo/ui/components/auth/auth-button";
import { InlineLink } from "@repo/ui/components/links/inline-link";
import { Section } from "@repo/ui/components/layout/section";

import styles from "./signup-form.module.css";
import { Typography } from "@repo/ui/components/typography/typography";

export function SignUpForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      <Section spacing="md">
        <AuthInput
          label="Full Name"
          type="text"
          placeholder="John Doe"
        />

        <AuthInput
          label="Email"
          type="email"
          placeholder="example@email.com"
        />

        <AuthInput
          label="Mobile Number"
          type="tel"
          placeholder="+123 456 789"
        />

        <AuthInput
          label="Date of Birth"
          type="text"
          placeholder="DD / MM / YYYY"
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
        />
      </Section>

      <Section spacing="lg" width="70" align="center">

         <Typography variant="xsmall">
          By continuing, you agree to the{" "}
          <InlineLink href="/terms-of-use">
            Terms of Use
          </InlineLink>

          {" "}and{" "}

           <InlineLink href="/terms-of-use">
            Privacy Policy
          </InlineLink>
        </Typography>

       <Section spacing="md">
          <AuthButton type="submit" variant="dark">
            Sign Up
          </AuthButton>
        </Section>

        <Typography variant="xsmall">
          Already have an account?{" "}
          <InlineLink href="/login">
            Log In
          </InlineLink>
        </Typography>
      </Section>

    </form>
  );
}
             