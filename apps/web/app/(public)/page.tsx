import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import styles from "./page.module.css";
import ScreenshotsSwiper from "../../components/screenshotsSwiper/ScreenshotsSwiper";
import { features, highlights, navLinks, screenshots,screenshotsDesktop, steps, techStack } from "./page.data";
import LandingIcon from "../../components/landingIcon/LandingIcon";
import ScrollToTopButton from "../../components/scrollToTopButton/ScrollToTopButton";
import { AppBadges } from "../../components/shared/appBadges";
import StickyLandingHeader from "../../components/navbar/stickyLandingHeader";

export default function Home(): ReactElement {

  const webAppUrl = process.env.NEXT_PUBLIC_WELMIO_WEB_APP_URL ?? "http://localhost:3000";
  const webAppLoginUrl = `${webAppUrl}/login`;
  const WELMIO_GITHUB_URL =
  process.env.NEXT_PUBLIC_WELMIO_GITHUB_URL ?? "https://github.com";
  const WELMIO_LINKEDIN_URL =
    process.env.NEXT_PUBLIC_WELMIO_LINKEDIN_URL ?? "https://www.linkedin.com";
  const WELMIO_TWITTER_URL =
    process.env.NEXT_PUBLIC_WELMIO_TWITTER_URL ?? "https://x.com";
  const WELMIO_CONTACT_EMAIL =
    process.env.NEXT_PUBLIC_WELMIO_CONTACT_EMAIL ?? "hello@welmio.app";
  const WELMIO_CONTACT_URL = `mailto:${WELMIO_CONTACT_EMAIL}`;

  return (
    <main className={styles.page}>
      <StickyLandingHeader
        className={styles.navbar}
        scrolledClassName={styles.navbarScrolled}
        heroId="landing-hero"
      >
        <Link href="/" className={styles.brand} aria-label="Welmio home">
          <Image src="/welmio-logo.png" alt="Welmio" width={52} height={52} priority />
          <strong>Welmio</strong>
        </Link>

        <nav className={styles.navLinks} aria-label="Landing navigation">
          {navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>

        <div className={styles.navActions}>
          <Link
            href={webAppLoginUrl}
            className={`${styles.navCta} ${styles.navCtaWeb}`}
          >
            <span className={styles.primaryButtonLabel}>
              Use Welmio on Web
              <LandingIcon name="monitor" />
            </span>
          </Link>

          <a
            href="#landing-hero"
            className={`${styles.navCta} ${styles.navCtaApp}`}
            aria-label="Go to the Welmio app download links"
          >
            <span className={styles.primaryButtonLabel}>
              Get the App
              <LandingIcon name="arrowUp" />
            </span>
          </a>
        </div>

        <details className={styles.mobileMenu}>
          <summary aria-label="Open navigation menu">
            <span />
            <span />
            <span />
          </summary>

          <nav className={styles.mobileMenuPanel} aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                <p className={styles.navLabel}>{link.label}</p>
              </a>
            ))}

            <div className={styles.mobileMenuActions}>
              <Link
                href={webAppLoginUrl}
                className={`${styles.mobileMenuCta} ${styles.mobileMenuCtaWeb}`}
              >
                <span className={styles.primaryButtonLabel}>
                  Use Welmio on Web
                  <LandingIcon name="monitor" />
                </span>
              </Link>

              <a
                href="#landing-hero"
                className={`${styles.mobileMenuCta} ${styles.mobileMenuCtaApp}`}
                aria-label="Go to the Welmio app download links"
              >
                <span className={styles.primaryButtonLabel}>
                  Get the App
                  <LandingIcon name="arrowUp" />
                </span>
              </a>
            </div>
          </nav>
        </details>
      </StickyLandingHeader>

      <section id="landing-hero" className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.badge}><LandingIcon name="sparkles" /> Available on Web · iOS · Android</p>
          <h1>Personal finance that works across <span>web and mobile.</span></h1>
          <p className={styles.heroText}>Track income, expenses, savings goals, and spending insights in a clean, responsive app built as a full-stack portfolio project.</p>
          <div className={styles.heroActions}>
            <Link href={webAppLoginUrl} className={styles.primaryButton}>
              <span className={styles.primaryButtonLabel}>
                Use Welmio on Web
                <LandingIcon name="monitor" />
              </span>
            </Link>
          </div>
          <AppBadges className={styles.heroStoreBadges} />
        </div>

        <div className={styles.heroVisual} aria-label="Welmio web and mobile dashboard preview">
          <div className={styles.decorDots} />
          <div className={styles.laptopFrame}>
            <Image src="/welmio_mockup_desktop.png" alt="Welmio desktop dashboard shown on a laptop" width={1116} height={640} sizes="(max-width: 760px) 92vw, (max-width: 1100px) 82vw, 680px" priority />
          </div>
          <div className={styles.phoneFrame}>
            <Image src="/welmio-mockup.png" alt="Welmio mobile dashboard shown on a phone" width={420} height={840} sizes="(max-width: 480px) 42vw, (max-width: 760px) 36vw, 240px" priority />
          </div>
        </div>
      </section>

      <section className={styles.highlights} aria-label="Welmio highlights">
        {highlights.map((item) => (
          <article key={item.title} className={styles.highlightCard}>
            <span className={styles.iconBubble}><LandingIcon name={item.icon} /></span>
            <div><h3>{item.title}</h3><p>{item.text}</p></div>
          </article>
        ))}
      </section>

      <section id="features" className={styles.section}>
        <div className={styles.sectionHeader}>
          <div><p className={styles.eyebrow}>Features</p><h2>Everything you need to manage your money</h2></div>
          <p>Explore all features inside the app.</p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.featureCard}>
              <span className={styles.iconBubble}><LandingIcon name={feature.icon} /></span>
              <div><h3>{feature.title}</h3><p>{feature.text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section id="screenshots" className={styles.section}>
        <div className={styles.compactHeader}>
          <p className={styles.eyebrow}>Screenshots</p>
          <h2>Beautiful, clean and intuitive interface</h2>
        </div>
        <ScreenshotsSwiper 
          screenshots={screenshots}
          screenshotsDesktop={screenshotsDesktop}
         />
      </section>

      <section id="how-it-works" className={styles.stepsSection}>
        <div className={styles.compactHeader}>
          <p className={styles.eyebrow}>How it works</p>
          <h2>Simple steps to better finances</h2>
        </div>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <article key={step.title} className={styles.stepCard}>
              <span className={styles.stepNumber}>{index + 1}</span>
              <span className={styles.iconBubble}><LandingIcon name={step.icon} /></span>
              <h3>{step.title}</h3><p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="tech-stack" className={styles.techSection}>
        <div className={styles.techCopy}>
          <p className={styles.eyebrow}>Built as a portfolio project</p>
          <h2>Built with modern technologies and best practices</h2>
          <p>Welmio is a full-stack personal finance app built to demonstrate real-world development skills, clean code and great UX.</p>
          <a href={WELMIO_GITHUB_URL}
             target="_blank"
             rel="noreferrer"
             aria-label="Open Welmio GitHub"
             className={styles.githubButton} 
          >
            View on GitHub <LandingIcon name="github" /></a>
        </div>
       <div className={styles.techGrid}>
        {techStack.map((tech) => (
          <article key={tech.name} className={styles.techCard}>
            <span className={styles.techLogo}>
              <Image
                src={tech.logoSrc}
                alt={`${tech.name} logo`}
                width={28}
                height={28}
              />
            </span>

            <div>
              <h3>{tech.name}</h3>
              <p>{tech.text}</p>
            </div>
          </article>
        ))}
      </div>
      </section>

      <section className={styles.ctaBand}>
        <div><p className={styles.eyebrow}>Use Welmio on Web</p><h2>Open the web app and explore all features</h2><p>No installation required. Just open and start using.</p></div>
        <div className={styles.ctaBandActions}>
          <Link href={webAppLoginUrl} className={styles.primaryButton}>
            <span className={styles.primaryButtonLabel}>
              Use Welmio on Web
              <LandingIcon name="monitor" />
            </span>
          </Link>
          <Link href="#tech-stack" className={styles.darkSecondaryButton}>View Tech Stack<LandingIcon name="external" /></Link>
          <p><LandingIcon name="check" /> Welmio is available now on web and iOS. Android coming soon.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.brand}>
            <Image src="/welmio-logo.png" alt="Welmio" width={56} height={56} />
            <span><strong>Welmio</strong><small>A personal finance app built to help you track, plan and achieve your financial goals.</small></span>
          </Link>
          <p>© 2026 Welmio. All rights reserved.</p>
        </div>
      <div className={styles.footerColumns}>
        <div>
          <h3>Product</h3>
          <a href="#features">Features</a>
          <a href="#screenshots">Screenshots</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        <div>
          <h3>Resources</h3>
          <a href={WELMIO_GITHUB_URL}
             target="_blank"
             rel="noreferrer"
             aria-label="Open Welmio GitHub Repository"
          >
              GitHub Repository</a>
          <a href="#tech-stack">Tech Stack</a>
        </div>

        <div>
          <h3>Support</h3>
          <a href="mailto:hello@welmio.app">Help Center</a>
          <a href="mailto:hello@welmio.app">Contact</a>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
          <Link href="/delete-account">Delete Account</Link>
        </div>

        <div className={styles.socials}>
          <h3>Connect</h3>

          <a
            href={WELMIO_GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Open Welmio GitHub"
          >
            <LandingIcon name="github" />
          </a>

          <a
            href={WELMIO_LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Open Welmio LinkedIn"
          >
            <LandingIcon name="linkedin" />
          </a>

          <a
            href={WELMIO_TWITTER_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Open Welmio X profile"
          >
            <LandingIcon name="twitter" />
          </a>

          <a href={WELMIO_CONTACT_URL} aria-label="Contact Welmio by email">
            <LandingIcon name="mail" />
          </a>
        </div>
      </div>
      </footer>

      <ScrollToTopButton/>
    </main>
  );
}
