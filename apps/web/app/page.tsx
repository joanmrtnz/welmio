import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/components/button/button";
import styles from "./page.module.css";
import { helloCore } from "@repo/core";
import { Typography } from "@repo/ui/components/typography/typography";
import { Container } from "@repo/ui/components/container/contianer";


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
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
           { helloCore() }
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <Button variant="primary" size="lg">
          Get started
          </Button>

          <Button variant="secondary" size="md">
            Learn more
          </Button>

          <Button variant="outline" size="sm">
            Secondary action
          </Button>
        </div>

        <section style={{ maxWidth: 600 }}>
           <Container>
            <Typography variant="h1">
              The easiest way to manage projects
            </Typography>

            <Typography variant="lead" style={{ marginTop: "1rem" }}>
              From the small stuff to the big picture, organizes the work
              so teams know what to do, why it matters, and how to get it done.
            </Typography>

            <div style={{ marginTop: "2rem" }}>
              <Button variant="secondary" size="md">
                Watch Video
              </Button>
            </div>
          </Container>
        </section>
        
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
