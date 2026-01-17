import Link from "next/link";
import styles from "./icon-link.module.css";

export function IconLink({
  href,
  children,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={styles.link}
    >
      {children}
    </Link>
  );
}
