"use client";

import { ElementType, HTMLAttributes } from "react";
import styles from "./typography.module.css";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "lead"
  | "text";

export interface TypographyProps
  extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: ElementType; // allows HTML tag override if necessary
}

export const Typography = ({
  variant = "text",
  as,
  className,
  children,
  ...props
}: TypographyProps) => {
  const Component = as || {
    h1: "h1",
    h2: "h2",
    lead: "p",
    text: "p",
  }[variant];

  const classes = [
    styles.typography,
    styles[`typography--${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};
