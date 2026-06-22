"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import styles from "../../app/(public)/page.module.css";

const SCROLL_THRESHOLD = 220;

export default function ScrollToTopButton(): ReactElement | null {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      className={styles.scrollToTopButton}
      onClick={handleClick}
      aria-label="Go to top"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 19V5M12 5L6 11M12 5L18 11"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}