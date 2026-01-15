import Image, { type ImageProps } from "next/image";
import styles from "./page.module.css";
import { Navbar } from "../../components/navbar/navbar";
import { HeroSection } from "../../components/hero/heroSection";
import { FeaturesSection } from "../../components/features/featuresSection";
import { TestimonialsSection } from "../../components/testimonials/testimonialsSection";
import { MetricsSection } from "../../components/metrics/metricsSection";
import { CtaSection } from "../../components/cta/ctaSection";
import { NAV_LINKS } from "../../components/navbar/navLinks";
import { Footer } from "../../components/footer/footer";
import { FOOTER_LINKS } from "../../components/footer/footerLinks";




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
        <Navbar links={NAV_LINKS} />

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

         <TestimonialsSection
          title="Real Stories from Real Customers"
          subtitle="Get inspired by these stories."
          testimonials={[
            {
              image: <img src="/profile-photo-1.png" />,
              name: "Sarah Connor",
              date: "01/01/2000",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.",
            },
            {
              image: <img src="/profile-photo-2.png" />,
              name: "Maria Who",
              date: "01/01/2000",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.",
            },
            {
              image: <img src="/profile-photo-3.png" />,
              name: "John Doe",
              date: "01/01/2000",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed erat nibh tristique ipsum.",
            },
          ]}
        />

         <MetricsSection
          title="Our 18 years of achievements"
          subtitle="With our super powers we have reached this"
          metrics={[
            {
              icon: <img src="/file-text.svg" />,
              title: "10,000+",
              description:
                "Downloads per day",
            },
            {
              icon: <img src="/globe.svg" />,
              title: "2,000,000+",
              description:
                "Users",
            },
            {
              icon: <img src="/window.svg" />,
              title: "500+",
              description:
                "Clients",
            },
            {
              icon: <img src="/file-text.svg" />,
              title: "140",
              description:
                "Countries",
            },
          ]}
        />

        <CtaSection
          title="Manage all projects from your mobile"
          subtitle="Download the app to manage your projects, keep track of the progress and complete tasks without procastinating. Stay on track and complete on time!."
          ctaText="Get the App"
        />

  
      </main>

      <Footer links={FOOTER_LINKS} />
    </div>
  );
}
