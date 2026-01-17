import Link from "next/link";
import styles from "./inline-link.module.css";

export function InlineLink({
  href,
  children,
  weight = "medium",
}: {
  href: string;
  children: React.ReactNode;
  weight?: "normal" | "medium" | "bold";
}) {
  return (
    <Link href={href} className={`${styles.link} ${styles[weight]}`}>
      {children}
    </Link>
  );
}
