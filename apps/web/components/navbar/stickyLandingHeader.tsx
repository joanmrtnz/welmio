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
  fullyHiddenClassName: string;
  heroId: string;
}

export default function StickyLandingHeader({
  children,
  className,
  scrolledClassName,
  fullyHiddenClassName,
  heroId,
}: StickyLandingHeaderProps): ReactElement {
  const headerRef = useRef<HTMLElement>(null);
  const [isHeroHidden, setIsHeroHidden] = useState(false);
  const [isHeroFullyHidden, setIsHeroFullyHidden] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    let fullyHiddenObserver: IntersectionObserver | undefined;

    const observeHero = () => {
      const header = headerRef.current;
      const hero = document.getElementById(heroId);

      observer?.disconnect();
      fullyHiddenObserver?.disconnect();

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

      fullyHiddenObserver = new IntersectionObserver(([entry]) => {
        setIsHeroFullyHidden(
          entry
            ? !entry.isIntersecting && entry.boundingClientRect.bottom <= 0
            : false,
        );
      });
      fullyHiddenObserver.observe(hero);
    };

    observeHero();
    window.addEventListener("resize", observeHero);

    return () => {
      observer?.disconnect();
      fullyHiddenObserver?.disconnect();
      window.removeEventListener("resize", observeHero);
    };
  }, [heroId]);

  const classes = [
    className,
    isHeroHidden && scrolledClassName,
    isHeroFullyHidden && fullyHiddenClassName,
  ]
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
