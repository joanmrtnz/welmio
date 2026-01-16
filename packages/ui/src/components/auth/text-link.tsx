import Link from "next/link";
import styles from "./text-link.module.css";

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={styles.link}>
      {children}
    </Link>
  );
}
