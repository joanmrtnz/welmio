import Image from "next/image";
import type { ReactElement } from "react";
import styles from "./appBadges.module.css";

const APP_STORE_URL = "https://apps.apple.com/es/app/welmio/id6783388398";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=dev.welmio.app";

interface AppBadgesProps {
  className?: string;
}

export const AppBadges = ({
  className,
}: AppBadgesProps): ReactElement => {
  const classes = [styles.badges, className].filter(Boolean).join(" ");

  return (
    <div className={classes} aria-label="Download Welmio">
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Download Welmio on the App Store"
      >
        <Image
          src="/store-badges/download-on-the-app-store.svg"
          alt="Download on the App Store"
          width={156}
          height={52}
          className={styles.badgeImage}
        />
      </a>

      <a
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Get Welmio on Google Play"
      >
        <Image
          src="/store-badges/get-it-on-google-play.svg"
          alt="Get it on Google Play"
          width={175}
          height={52}
          className={styles.badgeImage}
        />
      </a>
    </div>
  );
};
