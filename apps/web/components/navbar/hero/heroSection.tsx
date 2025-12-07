"use client";

import styles from "./heroSection.module.css";
import { Typography } from "@repo/ui/components/typography/typography";
import { Container } from "@repo/ui/components/container/container";
import { Button } from "@repo/ui/components/button/button";

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
            <Button size="lg">Get Started</Button>
            <Button variant="secondary" size="md">
              Watch Video
            </Button>
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
