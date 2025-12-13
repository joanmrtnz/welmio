"use client";

import styles from "./metricCard.module.css";
import { Typography } from "@repo/ui/components/typography/typography";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const MetricCard = ({ icon, title, description }: MetricCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>

      <div className={styles.metricsWrapper}>
        <Typography variant="h2" className={styles.title}>
          {title}
        </Typography>

        <Typography variant="text" className={styles.description}>
          {description}
        </Typography>
      </div>
    </div>
  );
};
