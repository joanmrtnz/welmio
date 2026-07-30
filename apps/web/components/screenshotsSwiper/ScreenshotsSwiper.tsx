"use client";

import Image from "next/image";
import {
  ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./../../app/(public)/page.module.css";

type Screenshot = {
  title: string;
  text: string;
  image: string;
};

type ScreenshotsSwiperProps = {
  screenshots: Screenshot[];
  screenshotsDesktop: Screenshot[];
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ScreenshotsSwiper({
  screenshots,
  screenshotsDesktop,
}: ScreenshotsSwiperProps): ReactElement | null {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const swipeStartX = useRef<number | null>(null);
  const swipeEndX = useRef<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleChange = () => {
      setIsDesktop(mediaQuery.matches);
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const activeScreenshots = isDesktop ? screenshotsDesktop : screenshots;

  useEffect(() => {
    setActiveIndex(0);
  }, [isDesktop]);

  const lastIndex = activeScreenshots.length - 1;

  const activeScreenshot = useMemo(
    () => activeScreenshots[activeIndex] ?? activeScreenshots[0],
    [activeIndex, activeScreenshots],
  );

  const imageDimensions = isDesktop
    ? {
        width: 1440,
        height: 900,
        sizes: "(min-width: 980px) 940px, (min-width: 760px) 860px, 78vw",
      }
    : {
        width: 420,
        height: 875,
        sizes: "(max-width: 560px) 78vw, (max-width: 900px) 38vw, 260px",
      };

  const thumbDimensions = isDesktop
    ? {
        width: 264,
        height: 165,
        sizes: "(min-width: 980px) 132px, 112px",
      }
    : {
        width: 84,
        height: 175,
        sizes: "54px",
      };

  const goTo = useCallback(
    (index: number) => {
      if (activeScreenshots.length === 0) return;

      if (index < 0) {
        setActiveIndex(lastIndex);
        return;
      }

      if (index > lastIndex) {
        setActiveIndex(0);
        return;
      }

      setActiveIndex(index);
    },
    [lastIndex, activeScreenshots.length],
  );

  const handleSwipeStart = (clientX: number) => {
    swipeStartX.current = clientX;
    swipeEndX.current = clientX;
  };

  const handleSwipeMove = (clientX: number) => {
    swipeEndX.current = clientX;
  };

  const handleSwipeEnd = () => {
    if (swipeStartX.current === null || swipeEndX.current === null) return;

    const distance = swipeStartX.current - swipeEndX.current;
    const minimumDistance = 45;

    if (distance > minimumDistance) goTo(activeIndex + 1);
    if (distance < -minimumDistance) goTo(activeIndex - 1);

    swipeStartX.current = null;
    swipeEndX.current = null;
  };

  if (!activeScreenshot) return null;

  return (
    <div
      className={styles.screenshotsSwiper}
      aria-label="Welmio screenshots carousel"
    >
      <div className={styles.swiperHeader}>
        <div>
          <h3>{activeScreenshot.title}</h3>
          <p>{activeScreenshot.text}</p>
        </div>

        <div className={styles.swiperActions}>
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous screenshot"
          >
            <span aria-hidden="true">&#8592;</span>
          </button>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next screenshot"
          >
            <span aria-hidden="true">&#8594;</span>
          </button>
        </div>
      </div>

      <div
        className={styles.swiperViewport}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          if (!touch) return;

          handleSwipeStart(touch.clientX);
        }}
        onTouchMove={(event) => {
          const touch = event.touches[0];
          if (!touch) return;

          handleSwipeMove(touch.clientX);
        }}
        onTouchEnd={handleSwipeEnd}
        onMouseDown={(event) => handleSwipeStart(event.clientX)}
        onMouseMove={(event) => {
          if (swipeStartX.current !== null) handleSwipeMove(event.clientX);
        }}
        onMouseUp={handleSwipeEnd}
        onMouseLeave={handleSwipeEnd}
      >
        <div
          className={styles.swiperTrack}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {activeScreenshots.map((screen, index) => (
            <article
              key={`${isDesktop ? "desktop" : "mobile"}-${screen.title}`}
              className={styles.swiperSlide}
              aria-hidden={index !== activeIndex}
            >
              <div className={styles.screenshotImageWrap}>
                <Image
                  src={screen.image}
                  alt={`Welmio ${screen.title} screen`}
                  width={imageDimensions.width}
                  height={imageDimensions.height}
                  sizes={imageDimensions.sizes}
                  priority={index === activeIndex}
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.screenshotThumbs} aria-label="Choose screenshot">
        {activeScreenshots.map((screen, index) => (
          <button
            key={`${isDesktop ? "desktop-thumb" : "mobile-thumb"}-${screen.title}`}
            type="button"
            className={index === activeIndex ? styles.activeThumb : undefined}
            onClick={() => goTo(index)}
            aria-label={`Show ${screen.title} screenshot`}
            aria-current={index === activeIndex ? "true" : undefined}
          >
            <Image
              src={screen.image}
              alt=""
              width={thumbDimensions.width}
              height={thumbDimensions.height}
              sizes={thumbDimensions.sizes}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
