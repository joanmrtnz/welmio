import type { IconCard, NavLink, Screenshot, TechStackItem } from "./page.types";

export const navLinks: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Screenshots", href: "#screenshots" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Tech Stack", href: "#tech-stack" },
];

export const highlights: IconCard[] = [
  {
    icon: "globe",
    title: "Web + Mobile Access",
    text: "Use your finances from any device, anytime.",
  },
  {
    icon: "code",
    title: "Portfolio Case Study",
    text: "A real project built to showcase full-stack skills.",
  },
  {
    icon: "shield",
    title: "Secure by Design",
    text: "Authentication and encrypted data protection.",
  },
  {
    icon: "database",
    title: "Demo Data Included",
    text: "Explore all features with safe, preloaded demo data.",
  },
];

export const features: IconCard[] = [
  {
    icon: "wallet",
    title: "Track Income & Expenses",
    text: "Easily add and categorize your transactions. Stay on top of your daily spending.",
  },
  {
    icon: "target",
    title: "Savings Goals",
    text: "Create goals, set target amounts and track your progress in real time.",
  },
  {
    icon: "chart",
    title: "Analytics & Reports",
    text: "Visualize your financial health with interactive charts and monthly insights.",
  },
  {
    icon: "swap",
    title: "Transaction Management",
    text: "View, filter and search all your transactions in one place with ease.",
  },
  {
    icon: "pie",
    title: "Budget Planning",
    text: "Plan your monthly budget and get a clear overview of your cash flow.",
  },
  {
    icon: "devices",
    title: "Responsive Design",
    text: "Fully responsive web app and mobile experience for a smooth, consistent UI.",
  },
];

export const screenshots: Screenshot[] = [
  {
    title: "Overview",
    text: "Balance, expenses, goals and weekly chart in one clean dashboard.",
    image: "/screenshots/welmio-overview.png",
  },
  {
    title: "Analytics",
    text: "Income, expenses and category insights with a focused mobile layout.",
    image: "/screenshots/welmio-analytics.png",
  },
  {
    title: "Transactions",
    text: "Browse, filter and review all income and expenses clearly.",
    image: "/screenshots/welmio-transactions.png",
  },
  {
    title: "Goals",
    text: "Track saved amounts, targets and goal progress in real time.",
    image: "/screenshots/welmio-goals.png",
  },
  {
    title: "Profile",
    text: "Manage profile, settings and account actions from a simple screen.",
    image: "/screenshots/welmio-profile.png",
  },
  {
    title: "Edit Avatar",
    text: "Customize your profile picture with a simple avatar selection screen.",
    image: "/screenshots/welmio-edit-avatar.png",
  },
  {
    title: "Login",
    text: "A soft emerald authentication screen designed for quick access.",
    image: "/screenshots/welmio-login.png",
  },
  {
    title: "Signup",
    text: "A complete account creation flow with the same visual language.",
    image: "/screenshots/welmio-signup.png",
  },
];

export const steps: IconCard[] = [
  {
    icon: "filePlus",
    title: "Add Transactions",
    text: "Add your income and expenses in seconds with details.",
  },
  {
    icon: "tag",
    title: "Categorize & Organize",
    text: "Categorize transactions and keep everything organized.",
  },
  {
    icon: "target",
    title: "Set Goals",
    text: "Create savings goals and track your progress.",
  },
  {
    icon: "chart",
    title: "Review & Improve",
    text: "Analyze your reports and make better financial decisions.",
  },
];

export const techStack: TechStackItem[] = [
  {
    logoSrc: "/stack/nextjs.svg",
    name: "Next.js",
    text: "Marketing Website",
  },
  {
    logoSrc: "/stack/expo.svg",
    name: "Expo + React Native",
    text: "iOS, Android and web app",
  },
  {
    logoSrc: "/stack/nestjs.svg",
    name: "NestJS",
    text: "API Framework",
  },
  {
    logoSrc: "/stack/prisma.svg",
    name: "Prisma + PostgreSQL",
    text: "Type-safe relational data layer",
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
  },
];