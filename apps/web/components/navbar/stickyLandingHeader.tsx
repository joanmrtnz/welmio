"use client";

import {
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface StickyLandingHeaderProps {
  children: ReactNode;
  className: string;
  scrolledClassName: string;
  heroId: string;
}

export default function StickyLandingHeader({
  children,
  className,
  scrolledClassName,
  heroId,
}: StickyLandingHeaderProps): ReactElement {
  const headerRef = useRef<HTMLElement>(null);
  const [isHeroHidden, setIsHeroHidden] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | undefined;

    const observeHero = () => {
      const header = headerRef.current;
      const hero = document.getElementById(heroId);

      observer?.disconnect();

      if (!header || !hero) {
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => setIsHeroHidden(entry ? !entry.isIntersecting : false),
        {
          rootMargin: `-${header.offsetHeight}px 0px 0px`,
          threshold: 0,
        },
      );
      observer.observe(hero);
    };

    observeHero();
    window.addEventListener("resize", observeHero);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observeHero);
    };
  }, [heroId]);

  const classes = [className, isHeroHidden && scrolledClassName]
    .filter(Boolean)
    .join(" ");

  const closeMobileMenu = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as Element;

    if (!target.closest('a[href^="#"]')) {
      return;
    }

    headerRef.current
      ?.querySelectorAll("details[open]")
      .forEach((details) => details.removeAttribute("open"));
  };

  return (
    <header ref={headerRef} className={classes} onClick={closeMobileMenu}>
      {children}
    </header>
  );
}
