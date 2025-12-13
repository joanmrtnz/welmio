"use client";

import styles from "./metricsSection.module.css";
import { Typography } from "@repo/ui/components/typography/typography";
import { MetricCard } from "./metricsCard";

interface Metric {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface MetricsSectionProps {
  title: string;
  subtitle: string;
  metrics: Metric[];
}

export const MetricsSection = ({
  title,
  subtitle,
  metrics,
}: MetricsSectionProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <Typography variant="h2">{title}</Typography>
        <Typography variant="text" className={styles.subtitle}>
          {subtitle}
        </Typography>
      </div>

      <div className={styles.grid}>
        {metrics.map((metric) => (
          <MetricCard
            key={metric.title}
            icon={metric.icon}
            title={metric.title}
            description={metric.description}
          />
        ))}
      </div>
    </section>
  );
};
