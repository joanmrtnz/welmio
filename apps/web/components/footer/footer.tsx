"use client";
import { Typography } from "@repo/ui/components/typography/typography";
import styles from "./footer.module.css";
import { Logo } from "../shared/logo";
import { AppBadges } from "../shared/appBadges";

interface NavLink {
  label: string;
  href: string;
}

interface FooterProps {
  links?: NavLink[];
}

export const Footer =  ({ 
  links = []
}: FooterProps)  => {
  return (
    <footer className={styles.footer}>
      <div className={styles.contactBlock}>

        <div className={styles.logo}><Logo /></div>
        <ul className={styles.linksGrid}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                <Typography variant="text">{link.label}</Typography>
              </a>
            </li>
          ))}
        </ul>
        
        <Typography variant="small" className={styles.legalText}>
            © 2026 Welmio. All rights reserved
          </Typography>
      </div> 
      <div className={styles.ctaBlock}> 
        <Typography variant="text" className={styles.ctaText}>
          Get the App
        </Typography>
        <AppBadges />
        </div>
    </footer>
  );
};
