import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Delete Account | Welmio",
  description:
    "How to delete your Welmio account and request deletion of associated data.",
};

const LEGAL_CONTACT_EMAIL = "privacy@welmio.dev";
const SUPPORT_CONTACT_EMAIL = "hello@welmio.dev";
const APP_DELETE_ACCOUNT_URL = "https://app.welmio.dev/profile/delete-account";

const deletionSections: Array<{ title: string; body: ReactNode }> = [
  {
    title: "1. Delete your account from the app",
    body: (
      <>
        To delete your Welmio account yourself, you must first sign in to your
        Welmio account. Then open the account deletion page in the app, review
        the information shown there and confirm the deletion request.
      </>
    ),
  },
  {
    title: "2. Steps to follow",
    body: (
     <>
        Open Welmio and sign in. Go to <strong>Profile</strong>, open{" "}
        <strong>Settings</strong>, and select{" "}
        <strong>Delete account</strong>. To confirm, type the word{" "}
        <strong>delete</strong> and complete the deletion. You can also use the
        button on this page to go directly to the deletion screen. If you are
        not already signed in, you will need to sign in first before continuing.
        </>
    ),
  },
  {
    title: "3. What data is deleted",
    body: (
      <>
        When your account is deleted, Welmio deletes or anonymizes the account
        data associated with your user profile where technically possible. This
        includes your profile information, authentication data, app settings,
        accounts, categories, transactions, goals, contributions and related
        personal finance records stored in Welmio.
      </>
    ),
  },
  {
    title: "4. Data that may be retained temporarily",
    body: (
      <>
        Some limited technical records may be retained temporarily when needed
        for security, abuse prevention, debugging, backups or legal obligations.
        These records are not kept for active use of the deleted account and are
        removed or anonymized when they are no longer needed.
      </>
    ),
  },
  {
    title: "5. If you cannot access your account",
    body: (
      <>
        If you cannot sign in, you can request account and data deletion by
        contacting us at{" "}
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>. You
        can also contact{" "}
        <a href={`mailto:${SUPPORT_CONTACT_EMAIL}`}>{SUPPORT_CONTACT_EMAIL}</a>.
        Please write from the email address linked to your Welmio account so we
        can verify the request.
      </>
    ),
  },
  {
    title: "6. More privacy information",
    body: (
      <>
        For more details about how Welmio handles personal data, please read the{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </>
    ),
  },
];

export default function DeleteAccountPage(): ReactElement {
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
          <Link href="/delete-account">Delete account</Link>
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
          <nav className={styles.mobileMenuPanel} aria-label="Mobile navigation">
            <Link href="/">
              <p className={styles.navLabel}>Home</p>
            </Link>
            <Link href="/privacy">
              <p className={styles.navLabel}>Privacy Policy</p>
            </Link>
            <Link href="/terms">
              <p className={styles.navLabel}>Terms of Use</p>
            </Link>
            <Link href="/delete-account">
              <p className={styles.navLabel}>Delete Account</p>
            </Link>
          </nav>
        </details>
      </header>

      <section className={styles.legalHero}>
        <p className={styles.eyebrow}>Welmio account deletion</p>
        <h1>Delete your Welmio account</h1>
        <p>
          Follow these steps to delete your Welmio account and request deletion
          of the data associated with it.
        </p>
      </section>

      <section className={styles.legalContent} aria-label="Delete account content">
        <article className={styles.legalCard}>
          <p className={styles.legalUpdated}>Last updated: June 2026</p>

          <div className={styles.legalNotice}>
            <strong>Sign-in required</strong>
            <p>
                To delete your account directly, you need to sign in first so
                Welmio can verify that the account belongs to you. After signing
                in, continue to the account deletion page and confirm the request.
            </p>

            <a
            href={APP_DELETE_ACCOUNT_URL}
            className={styles.deleteAccountButton}
            aria-label="Continue to the Welmio account deletion page"
            >
                Delete account
            </a>
          </div>

          <div className={styles.legalSections}>
            {deletionSections.map((section) => (
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
