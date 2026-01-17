import { Section } from "./section";
import styles from "./auth-page-layout.module.css";
import { Typography } from "@repo/ui/components/typography/typography";

export function AuthPageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className={styles.container}>
      <Section spacing="x3l">
        <Typography variant="h2" weight="bold">
          {title}
        </Typography>
      </Section>

      {children}
    </main>
  );
}
