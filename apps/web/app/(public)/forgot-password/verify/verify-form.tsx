"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthInput } from "@repo/ui/components/auth/auth-input";
import { AuthButton } from "@repo/ui/components/auth/auth-button";
import { Section } from "@repo/ui/components/layout/section";

import styles from "./verify-form.module.css";
import { InlineLink } from "@repo/ui/components/links/inline-link";
import { IconLink } from "@repo/ui/components/links/icon-link";
import { Typography } from "@repo/ui/components/typography/typography";
import { GoogleIcon } from "@repo/ui/icons/GoogleIcon";


export function VerifyForm() {
  const router = useRouter();

  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!code) return;
    router.push("/forgot-password/new-password");
  };

  const sendCode = () => {
    console.log("Sending recovery code again...");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      <Section spacing="x3l" align="left">
          <AuthInput
            label="Enter Recovery Code"
            type="code" 
            placeholder=""
            value={code}
            onChange={(e) => setCode(e.currentTarget.value)}
          />
      </Section>

      <Section spacing="xs">
        <AuthButton 
        type="submit" 
        variant="dark" 
        >
          Accept
        </AuthButton>
         <Section spacing="md">
          <AuthButton
            onClick={() => sendCode()}
            variant="light">
              Send Again
            </AuthButton>
        </Section>
      </Section>

      <Section spacing="x3l">
        <Typography variant="xxsmall">
          or sign up with{" "}
        </Typography>

        <Section spacing="md">
          <IconLink href="/signup-google" ariaLabel="Sign up with Google">
            <GoogleIcon size={25} />
          </IconLink>
        </Section>
    
       <Typography variant="xxsmall">
          Don't have an account?{" "}
          <InlineLink href="/signup">
            Sign Up
          </InlineLink>
        </Typography>
      </Section>
    </form>
  );
}
