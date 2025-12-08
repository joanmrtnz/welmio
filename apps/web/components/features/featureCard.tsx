"use client";

import styles from "./featureCard.module.css";
import { Typography } from "@repo/ui/components/typography/typography";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>

      <Typography variant="h2" className={styles.title}>
        {title}
      </Typography>

      <Typography variant="text" className={styles.description}>
        {description}
      </Typography>
    </div>
  );
};
