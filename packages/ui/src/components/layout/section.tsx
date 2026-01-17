import styles from "./section.module.css";

export function Section({
  children,
  spacing = "md",
  width = "full",
  align = "center",
}: {
  children: React.ReactNode;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl" | "x2l" | "x3l";
  width?: "full" | "70" | "50";
  align?: "center" | "left" | "right";
}) {
  return (
    <div
      className={`${styles.section} ${styles[spacing]} ${styles[`width-${width}`]} ${styles[`align-${align}`]}`}
    >
      {children}
    </div>
  );
}
