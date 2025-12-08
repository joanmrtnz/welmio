import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/components/button/button";
import styles from "./page.module.css";
import { helloCore } from "@repo/core";
import { Typography } from "@repo/ui/components/typography/typography";
import { Container } from "@repo/ui/components/container/container";
import { Navbar } from "../components/navbar/navbar";
import { HeroSection } from "../components/hero/heroSection";
import { FeatureCard } from "../components/features/featureCard";
import { FeaturesSection } from "../components/features/featureSection";


type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

  export default function Home() {
    return (
      <div>
        <main className={styles.main}>
        <Navbar
          logo={<img src="./welmio-logo.svg" alt="Welmio Logo" height={40} width={42}/>}
          links={[
            { label: "Features", href: "/Features" },
            { label: "Pricing", href: "/Pricing" },
            { label: "Careers", href: "/Careers" },
            { label: "Help", href: "/Help" },
          ]}
          rightSlot={
            <div style={{ display: "flex", gap: "1rem" }}>
              <img src="./google-play.svg" alt="Google Play" height={40} />
            </div>
          }
        />

        <HeroSection
        title="The easiest way to manage projects"
        subtitle="From the small stuff to the big picture, organize the work so teams know what to do, why it matters, and how to get it done."
        image="/welmio-mockup.png"
        imageAlt="Hero section image"
        />

        <FeaturesSection
          title="Tailor-made features"
          subtitle="Lorem ipsum is common placeholder text used to demonstrate the graphic elements..."
          features={[
            {
              icon: <img src="/file-text.svg" />,
              title: "Robust workflow",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.",
            },
            {
              icon: <img src="/globe.svg" />,
              title: "Flexibility",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.",
            },
            {
              icon: <img src="/window.svg" />,
              title: "User friendly",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.",
            },
            {
              icon: <img src="/file-text.svg" />,
              title: "Multiple layouts",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.",
            },
            {
              icon: <img src="/globe.svg" />,
              title: "Better components",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.",
            },
            {
              icon: <img src="/window.svg" />,
              title: "Well organised",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.",
            },
          ]}
        />
  
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://turborepo.com?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to turborepo.com →
        </a>
      </footer>
    </div>
  );
}
