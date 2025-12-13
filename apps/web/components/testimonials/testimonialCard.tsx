"use client";

import styles from "./testimonialCard.module.css";
import { Typography } from "@repo/ui/components/typography/typography";
import { QuotesIcon } from "@repo/ui/icons/QuotesIcon";

interface TestimonialCardProps {
  image: React.ReactNode;
  name: string;
  date: string;
  description: string;
}

export const TestimonialCard = ({ image, name, date, description }: TestimonialCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.descriptionWrapper}>
        <span className={styles.icon}>
          <QuotesIcon/>
        </span>
        <Typography variant="lead" className={styles.description}>
          {description}
        </Typography>
      </div>

       <div className={styles.image}>{image}</div>

      <Typography variant="small" className={styles.name}>
        {name}
      </Typography>

      <Typography variant="small" className={styles.date}>
        {date}
      </Typography>

      
    </div>
  );
};
