"use client";

import { HTMLAttributes, ReactNode, useState } from "react";
import styles from "./navbar.module.css";
import { Typography } from "@repo/ui/components/typography/typography";
import { Logo } from "../shared/logo";
import { AppBadges } from "../shared/appBadges";

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
  const [isOpen, setIsOpen] = useState(false);

  const classes = [styles.navbar, className].filter(Boolean).join(" ");

  return (
    <nav className={classes} {...props}>
      <div className={styles.inner}>
          <div className={styles.logo}><Logo /></div>

        <ul className={styles.linksDesktop}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                <Typography variant="text">{link.label}</Typography>
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.rightDesktop}><AppBadges /></div>

        <button
          className={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
      </div>

      <div
        className={`${styles.mobileMenu} ${
          isOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={styles.mobileLink}
                onClick={() => setIsOpen(false)}
              >
                <Typography variant="small">{link.label}</Typography>
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.mobileRight}><AppBadges /></div>
      </div>
    </nav>
  );
};
