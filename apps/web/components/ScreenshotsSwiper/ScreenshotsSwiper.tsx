"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import styles from "./../../app/(public)/page.module.css";

type Screenshot = {
  title: string;
  text: string;
  image: string;
};

type ScreenshotsSwiperProps = {
  screenshots: Screenshot[];
};

export default function ScreenshotsSwiper({ screenshots }: ScreenshotsSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  const swipeEndX = useRef<number | null>(null);
  const lastIndex = screenshots.length - 1;

  const activeScreenshot = useMemo(() => screenshots[activeIndex], [activeIndex, screenshots]);

  const goTo = useCallback(
    (index: number) => {
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
    [lastIndex],
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

  return (
    <div className={styles.screenshotsSwiper} aria-label="Welmio screenshots carousel">
      <div className={styles.swiperHeader}>
        <div>
          <h3>{activeScreenshot.title}</h3>
          <p>{activeScreenshot.text}</p>
        </div>
        <div className={styles.swiperActions}>
          <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous screenshot">‹</button>
          <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next screenshot">›</button>
        </div>
      </div>

      <div
        className={styles.swiperViewport}
        onTouchStart={(event) => handleSwipeStart(event.touches[0].clientX)}
        onTouchMove={(event) => handleSwipeMove(event.touches[0].clientX)}
        onTouchEnd={handleSwipeEnd}
        onMouseDown={(event) => handleSwipeStart(event.clientX)}
        onMouseMove={(event) => {
          if (swipeStartX.current !== null) handleSwipeMove(event.clientX);
        }}
        onMouseUp={handleSwipeEnd}
        onMouseLeave={handleSwipeEnd}
      >
        <div className={styles.swiperTrack} style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {screenshots.map((screen, index) => (
            <article key={screen.title} className={styles.swiperSlide} aria-hidden={index !== activeIndex}>
              <div className={styles.screenshotImageWrap}>
                <Image
                  src={screen.image}
                  alt={`Welmio ${screen.title} screen`}
                  width={420}
                  height={875}
                  sizes="(max-width: 560px) 78vw, (max-width: 900px) 38vw, 260px"
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.screenshotThumbs} aria-label="Choose screenshot">
        {screenshots.map((screen, index) => (
          <button
            key={screen.title}
            type="button"
            className={index === activeIndex ? styles.activeThumb : undefined}
            onClick={() => goTo(index)}
            aria-label={`Show ${screen.title} screenshot`}
            aria-current={index === activeIndex ? "true" : undefined}
          >
            <Image src={screen.image} alt="" width={84} height={175} sizes="54px" />
          </button>
        ))}
      </div>
    </div>
  );
}
