import styles from "./section.module.css";

export function Section({
  children,
  spacing = "md",
}: {
  children: React.ReactNode;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl" | "x2l" | "x3l";
}) {
  return (
    <div className={`${styles.section} ${styles[spacing]}`}>
      {children}
    </div>
  );
}
