import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Welmio",
  description:
    "How Welmio handles personal data in this non-commercial portfolio app.",
};

const LEGAL_CONTACT_EMAIL = "privacy@welmio.dev";
const RESPONSIBLE_NAME = "Welmio developer";
const HOSTING_LOCATION = "Spain";
const PRIVACY_URL = "https://welmio.dev/privacy";

const privacySections = [
  {
    title: "1. Data controller",
    body: `Welmio is operated by ${RESPONSIBLE_NAME} as a personal portfolio and source-available project. For privacy requests, you can contact the controller at ${LEGAL_CONTACT_EMAIL}.`,
  },
  {
    title: "2. What Welmio is",
    body: "Welmio is a real personal finance management app built as a professional portfolio project. It is not a commercial product, bank, financial institution, financial advisory service, tax advisor or accounting service. The source code may be publicly available under a non-commercial license.",
  },
  {
    title: "3. Portfolio and self-hosted context",
    body: `Welmio is provided as a portfolio project and not as a commercial managed service. The main app infrastructure is self-hosted in a homelab located in ${HOSTING_LOCATION}, so availability, monitoring and operational guarantees may be more limited than in a commercial cloud service. Avoid storing highly sensitive information that you do not need in the app.`,
  },
  {
    title: "4. Data we collect",
    body: "We collect the information needed to create and use your account: name, email address, encrypted password, optional phone number, optional date of birth, avatar preferences, accounts, categories, transactions, goals, contributions and app settings. We may also process basic technical data such as IP address, request logs, device/browser information and security events.",
  },
  {
    title: "5. Why we use your data",
    body: "We use your data to create and secure your account, authenticate you, verify your email, let you manage your financial records, calculate summaries and analytics, recover your password, send account-related emails, prevent abuse and keep the service working reliably.",
  },
  {
    title: "6. Legal basis",
    body: "The main legal basis is the provision of the service requested by the user when creating and using an account. Optional profile data may be processed based on your consent or voluntary action. Security logs and abuse prevention may be processed based on legitimate interest in protecting the app and its users.",
  },
  {
    title: "7. Third-party services",
    body: "Welmio may use trusted third-party providers only when needed to operate the app. For example, Resend may be used to send verification, password reset and security emails. GitHub may host the public source code, but it is not used to store user account data.",
  },
  {
    title: "8. Data retention",
    body: "Your account data is kept while your account remains active. If you delete your account, personal data will be deleted or anonymized where technically possible, except for limited technical logs, backups or records that may need to be retained temporarily for security, debugging or legal reasons.",
  },
  {
    title: "9. Your rights",
    body: `If you are in the EU/Spain, you may request access, rectification, deletion, restriction, portability and objection regarding your personal data. You can contact ${LEGAL_CONTACT_EMAIL}. You also have the right to lodge a complaint with the Spanish Data Protection Agency (AEPD).`,
  },
  {
    title: "10. Security",
    body: "Welmio uses basic security measures such as password hashing, JWT authentication, email verification, protected private endpoints, validation, rate limiting and restricted CORS for web clients. No system is completely secure, especially in a self-hosted portfolio context, so avoid storing sensitive information that you do not need in the app.",
  },
  {
    title: "11. Changes to this policy",
    body: `This policy may be updated as the project evolves, especially if new features, providers or deployment environments are added. The latest version will be available at ${PRIVACY_URL}.`,
  },
];

export default function PrivacyPolicyPage(): ReactElement {
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
        <p className={styles.eyebrow}>Welmio privacy</p>
        <h1>Privacy Policy</h1>
        <p>
          How Welmio handles personal data in this non-commercial portfolio app.
        </p>
      </section>

      <section className={styles.legalContent} aria-label="Privacy Policy content">
        <article className={styles.legalCard}>
          <p className={styles.legalUpdated}>Last updated: May 2026</p>

          <div className={styles.legalNotice}>
            <strong>Important portfolio notice</strong>
            <p>
              Welmio is not a bank, financial institution, financial advisor,
              tax advisor, accounting service or commercial managed service.
              Do not store highly sensitive information that you do not need
              inside the app.
            </p>
          </div>

          <div className={styles.legalSections}>
            {privacySections.map((section) => (
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
