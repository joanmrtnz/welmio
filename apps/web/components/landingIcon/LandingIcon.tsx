import type { ReactElement, SVGAttributes } from "react";
import { IconName } from "../../app/(public)/page.types";

type LandingIconProps = SVGAttributes<SVGSVGElement> & {
  name: IconName;
};

export default function LandingIcon({
  name,
  ...props
}: LandingIconProps): ReactElement {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<IconName, ReactElement> = {
    sparkles: (
      <>
        <path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z" />
        <path d="M5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15Z" />
      </>
    ),
    monitor: (
      <>
        <path d="M4 5h16v11H4z" />
        <path d="M9 21h6" />
        <path d="M12 16v5" />
      </>
    ),
    arrowUp: (
      <>
        <path d="m6 10 6-6 6 6" />
        <path d="M12 4v16" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6" />
        <path d="M10 14 20 4" />
        <path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />
      </>
    ),
    check: <path d="M20 6 9 17l-5-5" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15 15 0 0 1 0 20" />
        <path d="M12 2a15 15 0 0 0 0 20" />
      </>
    ),
    code: (
      <>
        <path d="m8 9-4 3 4 3" />
        <path d="m16 9 4 3-4 3" />
        <path d="m14 5-4 14" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </>
    ),
    wallet: (
      <>
        <path d="M3 7h15a3 3 0 0 1 3 3v8H5a2 2 0 0 1-2-2V7Z" />
        <path d="M3 7V5a2 2 0 0 1 2-2h12v4" />
        <path d="M16 13h5" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
        <path d="m16 8 4-4" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M10 19V9" />
        <path d="M16 19V3" />
        <path d="M22 19V12" />
      </>
    ),
    swap: (
      <>
        <path d="M7 7h14l-4-4" />
        <path d="M17 17H3l4 4" />
      </>
    ),
    pie: (
      <>
        <path d="M21 12A9 9 0 1 1 12 3v9h9Z" />
        <path d="M12 3a9 9 0 0 1 9 9" />
      </>
    ),
    devices: (
      <>
        <rect x="3" y="4" width="13" height="16" rx="2" />
        <rect x="18" y="9" width="4" height="10" rx="1" />
        <path d="M8 18h3" />
      </>
    ),
    filePlus: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M12 12v6" />
        <path d="M9 15h6" />
      </>
    ),
    tag: (
      <>
        <path d="M20 10 12 2H4v8l8 8a2.8 2.8 0 0 0 4 0l4-4a2.8 2.8 0 0 0 0-4Z" />
        <path d="M7 7h.01" />
      </>
    ),
    github: (
      <>
        <path d="M15 22v-4a4 4 0 0 0-1-3c3 0 6-2 6-6a4.6 4.6 0 0 0-1.3-3.2A4.3 4.3 0 0 0 18.6 3s-1-.3-3.3 1.2a11.4 11.4 0 0 0-6 0C7 2.7 6 3 6 3a4.3 4.3 0 0 0-.1 2.8A4.6 4.6 0 0 0 4.6 9c0 4 3 6 6 6a4 4 0 0 0-1 3v4" />
        <path d="M9 18c-4.5 2-5-2-7-2" />
      </>
    ),
    linkedin: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
        <path d="M2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
    twitter: (
      <path d="M22 5.8c-.8.4-1.7.6-2.6.7a4.5 4.5 0 0 0-7.8 4.1A12.8 12.8 0 0 1 2.3 6s-4 9 5 13a13 13 0 0 1-7 2c9 5 20 0 20-11.5v-.5c.8-.6 1.4-1.3 1.9-2.2Z" />
    ),
    mail: (
      <>
        <path d="M4 4h16v16H4z" />
        <path d="m22 6-10 7L2 6" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...common} {...props}>
      {paths[name]}
    </svg>
  );
}
