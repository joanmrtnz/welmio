"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Typography } from "../../typography/typography";
import { Section } from "../../layout/section";

import styles from "./success-message.module.css";

export function SuccessMessage({
  title,
  autoRedirectTo,
  delay = 2500,
}: {
  title: string;
  autoRedirectTo?: string;
  delay?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!autoRedirectTo) return;

    const timer = setTimeout(() => {
      router.push(autoRedirectTo);
    }, delay);

    return () => clearTimeout(timer);
  }, [autoRedirectTo, delay, router]);

  return (
    <main className={styles.container}>
      <Section spacing="x3l" align="center">
        <div className={styles.iconWrapper}>
          <svg
            className={styles.successIcon}
            width="96"
            height="96"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="white"
              strokeWidth="6"
              className={styles.circle}
            />
            <circle
              cx="34"
              cy="42"
              r="6"
              fill="white"
              className={styles.dot}
            />
          </svg>
        </div>

        <Section spacing="sm" width="70" align="center">
            <Typography variant="lead" weight="bold">
            {title}
            </Typography>
        </Section>
      </Section>
    </main>
  );
}
