"use client";

import styles from "./featuresSection.module.css";
import { Typography } from "@repo/ui/components/typography/typography";
import { FeatureCard } from "./featureCard";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  title: string;
  subtitle: string;
  features: Feature[];
}

export const FeaturesSection = ({
  title,
  subtitle,
  features,
}: FeaturesSectionProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <Typography variant="h1">{title}</Typography>
        <Typography variant="lead" className={styles.subtitle}>
          {subtitle}
        </Typography>
      </div>

      <div className={styles.grid}>
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};
