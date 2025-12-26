"use client";

import styles from "./ctaSection.module.css";
import { Typography } from "@repo/ui/components/typography/typography";
import clsx from "clsx";
import { AppBadges } from "../shared/appBadges";

interface ctaSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
}

export const CtaSection = ({
  title,
  subtitle,
  ctaText
}: ctaSectionProps) => {
  return (
   <section className={styles.section}>
    <div className={styles.content}>
      <div className={styles.header}>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="text" className={styles.subtitle}>
          {subtitle}
        </Typography>
     
        <div className={styles.cta}>
          <Typography variant="text" className={styles.ctaText}>
            {ctaText}
          </Typography>

         <AppBadges />
        </div>
      </div>

      <div className={styles.images}>
        <div className={styles.imageWrapper_1}>
            <img src="/welmio-mockup-cta-1.png" alt="CTA mobile image 1" className={clsx(styles.image, styles.shadow)}/>
        </div>

         <div className={styles.imageWrapper_2}>
            <img src="/welmio-mockup-cta-2.png" alt="CTA mobile image 2" className={styles.image} />
        </div>
     
      </div>
    </div>
    </section>
  );
};
