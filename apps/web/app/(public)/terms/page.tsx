import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Terms of Use | Welmio",
  description:
    "Terms for using Welmio as a non-commercial portfolio app.",
};

const LEGAL_CONTACT_EMAIL = "privacy@welmio.dev";
const LICENSE_NAME = "non-commercial source-available license";
const TERMS_URL = "https://welmio.dev/terms";

const termsSections = [
  {
    title: "1. Acceptance of these terms",
    body: "By creating an account or using Welmio, you agree to these terms. If you do not agree, you should not use the app. These terms are intended for a first public portfolio version and may be updated as the project evolves.",
  },
  {
    title: "2. About Welmio",
    body: "Welmio is a personal finance tracking app created as a real portfolio project to demonstrate software development skills. It helps users organize accounts, categories, transactions, goals and financial summaries. It is not a commercial financial product, bank, financial institution, financial advisor, tax advisor or accounting service.",
  },
  {
    title: "3. Portfolio and non-commercial purpose",
    body: "The app is provided mainly for demonstration, educational and portfolio purposes. The project may be publicly available on GitHub, but the code is intended to be used only under the license defined in the repository. Commercial use, resale or use of the code in paid products is not allowed unless the license or the developer explicitly permits it.",
  },
  {
    title: "4. Source code license",
    body: `The source code is made available under a ${LICENSE_NAME}. This means the code can be reviewed for learning and portfolio evaluation, but it must not be copied, sold, integrated into commercial products or used to provide commercial services unless the license says otherwise. Always check the LICENSE file in the repository.`,
  },
  {
    title: "5. Account responsibility",
    body: "You are responsible for keeping your login credentials secure and for the information you add to your account. Use a strong password and do not share your account with other people. You must not try to access accounts, data or API endpoints that do not belong to you.",
  },
  {
    title: "6. No financial advice",
    body: "Welmio is only an organizational tool. It does not provide financial, legal, tax, accounting or investment advice. Charts, totals and analytics are generated from the data you enter and should not be used as the sole basis for financial decisions.",
  },
  {
    title: "7. Acceptable use",
    body: "You agree not to abuse the service, attack the API, bypass authentication, exploit vulnerabilities, scrape data, upload malicious content or use the app for illegal activity. If you discover a security issue, please report it responsibly instead of exploiting it.",
  },
  {
    title: "8. Availability and homelab hosting",
    body: "Welmio is self-hosted from a homelab in Spain. The service may be interrupted because of maintenance, network issues, power outages, hardware changes or project updates. No guarantee is made that the app will be available continuously.",
  },
  {
    title: "9. Data and account deletion",
    body: "You can update your profile and request or use the account deletion flow when available. Deleting your account will remove or anonymize your personal data where technically possible, although limited logs or backups may remain temporarily for security, debugging or legal reasons.",
  },
  {
    title: "10. Limitation of liability",
    body: "Welmio is provided as a portfolio project on an as-is basis. The developer is not responsible for losses, incorrect data, service interruptions, decisions made using the app, or issues caused by user misuse, except where applicable law says otherwise.",
  },
  {
    title: "11. Changes to the service or terms",
    body: `Features, routes, integrations and these terms may change over time. If there are important changes, reasonable efforts will be made to make them visible in the app, repository or at ${TERMS_URL}.`,
  },
  {
    title: "12. Contact",
    body: `For questions about these terms, privacy or responsible security reports, contact ${LEGAL_CONTACT_EMAIL}.`,
  },
];

export default function TermsOfUsePage(): ReactElement {
  return (
    <main className={styles.page}>
      <header className={styles.navbar}>
        <Link href="/" className={styles.brand} aria-label="Welmio home">
          <Image src="/welmio-logo.png" alt="Welmio" width={52} height={52} priority />
          <span>
            <strong>Welmio</strong>
            <small>Personal Finance App</small>
          </span>
        </Link>

        <nav className={styles.navLinks} aria-label="Legal navigation">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>

        <Link href="/" className={styles.navCta}>
          Back home
        </Link>

        <details className={styles.mobileMenu}>
          <summary aria-label="Open navigation menu">
            <span />
            <span />
            <span />
          </summary>
          <div>
            <Link href="/">Home</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
          </div>
        </details>
      </header>

      <section className={styles.legalHero}>
        <p className={styles.eyebrow}>Welmio legal</p>
        <h1>Terms of Use</h1>
        <p>Terms for using Welmio as a non-commercial portfolio app.</p>
      </section>

      <section className={styles.legalContent} aria-label="Terms of Use content">
        <article className={styles.legalCard}>
          <p className={styles.legalUpdated}>Last updated: May 2026</p>

          <div className={styles.legalNotice}>
            <strong>Important portfolio notice</strong>
            <p>
              Welmio is provided for portfolio, educational and demonstration
              purposes. It is not a bank, financial institution, financial
              advisor, tax advisor, accounting service or commercial managed
              service.
            </p>
          </div>

          <div className={styles.legalSections}>
            {termsSections.map((section) => (
              <section key={section.title} className={styles.legalSection}>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
              </section>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
