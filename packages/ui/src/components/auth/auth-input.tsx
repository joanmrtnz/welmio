import styles from "./auth-input.module.css";

export function AuthInput({
  label,
  type,
  placeholder,
}: {
  label: string;
  type: string;
  placeholder?: string;
}) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className={styles.input}
      />
    </div>
  );
}
