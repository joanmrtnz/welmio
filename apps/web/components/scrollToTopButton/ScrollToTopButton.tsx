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
      <span aria-hidden="true">&#8593;</span>
    </button>
  );
}
