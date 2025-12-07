"use client";

import { HTMLAttributes, ReactNode } from "react";
import styles from "./navbar.module.css";
import { Container } from "@repo/ui/components/container/contianer";
import { Typography } from "@repo/ui/components/typography/typography";

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  links?: NavLink[];
  rightSlot?: ReactNode;
}

export const Navbar = ({
  logo,
  links = [],
  rightSlot,
  className,
  ...props
}: NavbarProps) => {
  const classes = [styles.navbar, className].filter(Boolean).join(" ");

  return (
    <nav className={classes} {...props}>
      <Container className={styles.inner}>
        <div className={styles.logo}>{logo}</div>

        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                 <Typography variant="text">
                    {link.label}
                </Typography>
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.right}>{rightSlot}</div>
      </Container>
    </nav>
  );
};
