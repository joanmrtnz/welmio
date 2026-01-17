import styles from "./auth-button.module.css";

export function AuthButton({
  children,
  variant = "dark",
  type = "button",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "dark" | "light";
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
