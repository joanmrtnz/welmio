"use client";

import styles from "./testimonialsSection.module.css";
import { Typography } from "@repo/ui/components/typography/typography";
import { TestimonialCard } from "./testimonialCard";
import { QuotesIcon } from "@repo/ui/icons/QuotesIcon";

interface Testimonial {
  image: React.ReactNode;
  name: string;
  date: string;
  description: string;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

export const TestimonialsSection = ({
  title,
  subtitle,
  testimonials,
}: TestimonialsSectionProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.header}>

          <div className={styles.titleWrapper}>
            <span className={styles.backgroundIcon}>
              <QuotesIcon/>
            </span>

            <Typography className={styles.title} variant="h3">{title}</Typography>
          </div>

          <Typography variant="lead" className={styles.subtitle}>
            {subtitle}
          </Typography>
        </div>

        <div className={styles.grid}>
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.name}
              image={testimonial.image}
              name={testimonial.name}
              date={testimonial.date}
              description={testimonial.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
