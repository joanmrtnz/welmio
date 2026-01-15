"use client";

import styles from "./heroSection.module.css";
import { Typography } from "@repo/ui/components/typography/typography";
import { Container } from "@repo/ui/components/container/container";
import { Button } from "@repo/ui/components/button/button";
import Link from "next/link";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  image?: string;
  imageAlt?: string;
}

export const HeroSection = ({
  title,
  subtitle,
  image,
  imageAlt,
}: HeroSectionProps) => {
  return (
    <section className={styles.hero}>
      <Container className={styles.inner}>
        <div className={styles.textContent}>
          <Typography variant="h1">{title}</Typography>

          <Typography variant="lead" className={styles.subtitle}>
            {subtitle}
          </Typography>

          <div className={styles.actions}>
            <Link href="/login">
               <Button size="xs">Login</Button>
            </Link>
           
            <Link href="/signup">
              <Button variant="secondary" size="xs">Sign Up</Button>
            </Link>
          </div>
        </div>

        {image && (
          <div className={styles.imageWrapper}>
            <img src={image} alt={imageAlt} className={styles.image} />
          </div>
        )}
      </Container>
    </section>
  );
};
