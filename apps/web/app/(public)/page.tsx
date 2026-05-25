import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import styles from "./page.module.css";
import ScreenshotsSwiper from "../../components/ScreenshotsSwiper/ScreenshotsSwiper";

type IconName =
  | "sparkles"
  | "monitor"
  | "external"
  | "check"
  | "globe"
  | "code"
  | "shield"
  | "database"
  | "wallet"
  | "target"
  | "chart"
  | "swap"
  | "pie"
  | "devices"
  | "filePlus"
  | "tag"
  | "github"
  | "linkedin"
  | "twitter"
  | "mail";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Screenshots", href: "#screenshots" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Tech Stack", href: "#tech-stack" },
];

const highlights = [
  { icon: "globe" as const, title: "Web + Mobile Access", text: "Use your finances from any device, anytime." },
  { icon: "code" as const, title: "Portfolio Case Study", text: "A real project built to showcase full-stack skills." },
  { icon: "shield" as const, title: "Secure by Design", text: "Authentication and encrypted data protection." },
  { icon: "database" as const, title: "Demo Data Included", text: "Explore all features with safe, preloaded demo data." },
];

const features = [
  { icon: "wallet" as const, title: "Track Income & Expenses", text: "Easily add and categorize your transactions. Stay on top of your daily spending." },
  { icon: "target" as const, title: "Savings Goals", text: "Create goals, set target amounts and track your progress in real time." },
  { icon: "chart" as const, title: "Analytics & Reports", text: "Visualize your financial health with interactive charts and monthly insights." },
  { icon: "swap" as const, title: "Transaction Management", text: "View, filter and search all your transactions in one place with ease." },
  { icon: "pie" as const, title: "Budget Planning", text: "Plan your monthly budget and get a clear overview of your cash flow." },
  { icon: "devices" as const, title: "Responsive Design", text: "Fully responsive web app and mobile experience for a smooth, consistent UI." },
];

const screenshots = [
  { title: "Overview", text: "Balance, expenses, goals and weekly chart in one clean dashboard.", image: "/screenshots/welmio-overview.png" },
  { title: "Analytics", text: "Income, expenses and category insights with a focused mobile layout.", image: "/screenshots/welmio-analytics.png" },
  { title: "Transactions", text: "Browse, filter and review all income and expenses clearly.", image: "/screenshots/welmio-transactions.png" },
  { title: "Goals", text: "Track saved amounts, targets and goal progress in real time.", image: "/screenshots/welmio-goals.png" },
  { title: "Profile", text: "Manage profile, settings and account actions from a simple screen.", image: "/screenshots/welmio-profile.png" },
  {title: "Edit Avatar", text: "Customize your profile picture with a simple avatar selection screen.", image: "/screenshots/welmio-edit-avatar.png"},
  { title: "Login", text: "A soft emerald authentication screen designed for quick access.", image: "/screenshots/welmio-login.png" },
  { title: "Signup", text: "A complete account creation flow with the same visual language.", image: "/screenshots/welmio-signup.png" },
];

const steps = [
  { icon: "filePlus" as const, title: "Add Transactions", text: "Add your income and expenses in seconds with details." },
  { icon: "tag" as const, title: "Categorize & Organize", text: "Categorize transactions and keep everything organized." },
  { icon: "target" as const, title: "Set Goals", text: "Create savings goals and track your progress." },
  { icon: "chart" as const, title: "Review & Improve", text: "Analyze your reports and make better financial decisions." },
];

const techStack = [
  {
    logoSrc: "/stack/nextjs.svg",
    name: "Next.js",
    text: "Marketing Website",
  },
  {
    logoSrc: "/stack/expo.svg",
    name: "Expo + React Native",
    text: "iOS, Android and web app"
  },
  {
    logoSrc: "/stack/nestjs.svg",
    name: "NestJS",
    text: "API Framework",
  },
  {
    logoSrc: "/stack/prisma.svg",
    name: "Prisma + PostgreSQL",
    text: "Type-safe relational data layer"
  },
  {
    logoSrc: "/stack/jwt.svg",
    name: "JWT",
    text: "API Authentication",
  },
  {
    logoSrc: "/stack/turborepo.svg",
    name: "Turborepo + pnpm",
    text: "Scalable monorepo architecture",
  }
];

function Icon({ name }: { name: IconName }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<IconName, ReactElement> = {
    sparkles: <><path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z" /><path d="M5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Z" /></>,
    monitor: <><path d="M4 5h16v11H4z" /><path d="M9 21h6" /><path d="M12 16v5" /></>,
    external: <><path d="M14 4h6v6" /><path d="M10 14 20 4" /><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" /></>,
    check: <path d="M20 6 9 17l-5-5" />,
    globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20" /><path d="M12 2a15 15 0 0 0 0 20" /></>,
    code: <><path d="m8 9-4 3 4 3" /><path d="m16 9 4 3-4 3" /><path d="m14 5-4 14" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
    wallet: <><path d="M3 7h15a3 3 0 0 1 3 3v8H5a2 2 0 0 1-2-2V7Z" /><path d="M3 7V5a2 2 0 0 1 2-2h12v4" /><path d="M16 13h5" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /><path d="m16 8 4-4" /></>,
    chart: <><path d="M4 19V5" /><path d="M10 19V9" /><path d="M16 19V3" /><path d="M22 19V12" /></>,
    swap: <><path d="M7 7h14l-4-4" /><path d="M17 17H3l4 4" /></>,
    pie: <><path d="M21 12A9 9 0 1 1 12 3v9h9Z" /><path d="M12 3a9 9 0 0 1 9 9" /></>,
    devices: <><rect x="3" y="4" width="13" height="16" rx="2" /><rect x="18" y="9" width="4" height="10" rx="1" /><path d="M8 18h3" /></>,
    filePlus: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M12 12v6" /><path d="M9 15h6" /></>,
    tag: <><path d="M20 10 12 2H4v8l8 8a2.8 2.8 0 0 0 4 0l4-4a2.8 2.8 0 0 0 0-4Z" /><path d="M7 7h.01" /></>,
    github: <><path d="M15 22v-4a4 4 0 0 0-1-3c3 0 6-2 6-6a4.6 4.6 0 0 0-1.3-3.2A4.3 4.3 0 0 0 18.6 3s-1-.3-3.3 1.2a11.4 11.4 0 0 0-6 0C7 2.7 6 3 6 3a4.3 4.3 0 0 0-.1 2.8A4.6 4.6 0 0 0 4.6 9c0 4 3 6 6 6a4 4 0 0 0-1 3v4" /><path d="M9 18c-4.5 2-5-2-7-2" /></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" /><path d="M2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></>,
    twitter: <path d="M22 5.8c-.8.4-1.7.6-2.6.7a4.5 4.5 0 0 0-7.8 4.1A12.8 12.8 0 0 1 2.3 6s-4 9 5 13a13 13 0 0 1-7 2c9 5 20 0 20-11.5v-.5c.8-.6 1.4-1.3 1.9-2.2Z" />,
    mail: <><path d="M4 4h16v16H4z" /><path d="m22 6-10 7L2 6" /></>,
  };

  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common}>{paths[name]}</svg>;
}

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.navbar}>
        <Link href="/" className={styles.brand} aria-label="Welmio home">
          <Image src="/welmio-logo.png" alt="Welmio" width={52} height={52} priority />
          <span><strong>Welmio</strong><small>Personal Finance App</small></span>
        </Link>

        <nav className={styles.navLinks} aria-label="Landing navigation">
          {navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>

        <Link href="/login" className={styles.navCta}>Use Welmio on Web <Icon name="monitor" /></Link>

        <details className={styles.mobileMenu}>
          <summary aria-label="Open navigation menu"><span /><span /><span /></summary>
          <div>
            {navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
            <Link href="/login">Use Welmio on Web</Link>
          </div>
        </details>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.badge}><Icon name="sparkles" /> Web & Mobile Ready</p>
          <h1>Welmio — personal finance for <span>web and mobile.</span></h1>
          <p className={styles.heroText}>Track income, expenses, savings goals, and spending insights in a clean, responsive app built as a full-stack portfolio project.</p>
          <div className={styles.heroActions}>
            <Link href="/login" className={styles.primaryButton}><Icon name="monitor" /> Use Welmio on Web</Link>
            <Link href="#screenshots" className={styles.secondaryButton}>See How It Works<Icon name="external" /></Link>
          </div>
          <p className={styles.demoNote}><Icon name="check" /> Free demo project. No real banking connection required.</p>
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
            <span className={styles.iconBubble}><Icon name={item.icon} /></span>
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
              <span className={styles.iconBubble}><Icon name={feature.icon} /></span>
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
        <ScreenshotsSwiper screenshots={screenshots} />
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
              <span className={styles.iconBubble}><Icon name={step.icon} /></span>
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
          <a href="https://github.com" className={styles.githubButton} target="_blank" rel="noreferrer">View on GitHub <Icon name="github" /></a>
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
          <Link href="/login" className={styles.primaryButton}>Open Web App <Icon name="monitor" /></Link>
          <Link href="#tech-stack" className={styles.darkSecondaryButton}>View Tech Stack<Icon name="external" /></Link>
          <p><Icon name="check" /> Welmio is available now on web. Native mobile apps for iOS and Android are coming soon.</p>
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
          <div><h3>Product</h3><a href="#features">Features</a><a href="#screenshots">Screenshots</a><a href="#how-it-works">How It Works</a></div>
          <div><h3>Resources</h3><a href="https://github.com">GitHub Repository</a><a href="#tech-stack">Tech Stack</a></div>
          <div><h3>Support</h3><a href="mailto:hello@welmio.app">Help Center</a><a href="mailto:hello@welmio.app">Contact</a><a href="#privacy">Privacy Policy</a></div>
          <div className={styles.socials}><h3>Connect</h3><span><Icon name="github" /></span><span><Icon name="linkedin" /></span><span><Icon name="twitter" /></span><span><Icon name="mail" /></span></div>
        </div>
      </footer>
    </main>
  );
}
