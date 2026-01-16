import styles from "./auth-button.module.css";

export function AuthButton({
  children,
  variant = "dark",
}: {
  children: React.ReactNode;
  variant?: "dark" | "light";
}) {
  return (
    <button
      type="submit"
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
