import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/components/button/button";
import styles from "./page.module.css";
import { helloCore } from "@repo/core";
import { Typography } from "@repo/ui/components/typography/typography";
import { Container } from "@repo/ui/components/container/container";
import { Navbar } from "../components/navbar/navbar";
import { HeroSection } from "../components/navbar/hero/heroSection";


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
      <div className={styles.page}>
        <main className={styles.main}>
        <Navbar
          logo={<img src="./welmio-logo.svg" alt="Welmio Logo" height={40}/>}
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
