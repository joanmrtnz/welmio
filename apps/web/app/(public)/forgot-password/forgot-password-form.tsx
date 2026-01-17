"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@repo/ui/components/auth/auth-input";
import { AuthButton } from "@repo/ui/components/auth/auth-button";
import { Section } from "@repo/ui/components/layout/section";

import styles from "./forgot-password-form.module.css";
import { InlineLink } from "@repo/ui/components/links/inline-link";
import { IconLink } from "@repo/ui/components/links/icon-link";
import { Typography } from "@repo/ui/components/typography/typography";
import { GoogleIcon } from "@repo/ui/icons/GoogleIcon";


export function ForgotPasswordForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return;
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      <Section spacing="xl" align="left">
         <Typography variant="h3" weight="bold">
          Reset password?
         </Typography>
         <Section spacing="sm" align="left">
          <Typography variant="xsmall" weight="medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          </Typography>
         </Section>
      </Section>

      <Section spacing="x2l" align="left">
          <AuthInput
            label="Enter Email Address"
            type="email"
            placeholder="example@email.com"
          />
      </Section>

        <Section spacing="xs">
          <AuthButton type="submit" variant="dark">
            Next Step
          </AuthButton>
      </Section>

      <Section spacing="x3l">
         <Section spacing="md">
          <AuthButton
            onClick={() => router.push("/signup")}
            variant="light">
              Sign Up
            </AuthButton>
          </Section>

        <Typography variant="xxsmall">
          or sign up with{" "}
        </Typography>

        <Section spacing="md">
          <IconLink href="/sign-up-google" ariaLabel="Sign up with Google">
            <GoogleIcon size={25} />
          </IconLink>
        </Section>
    
       <Typography variant="xxsmall">
          Don't have an account?{" "}
          <InlineLink href="/sign-up">
            Sign Up
          </InlineLink>
        </Typography>
      </Section>
    </form>
  );
}
