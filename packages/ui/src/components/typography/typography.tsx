"use client";

import { ElementType, HTMLAttributes } from "react";
import styles from "./typography.module.css";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "lead"
  | "text"
  | "small"
  | "xsmall"
  | "xxsmall";

export type TypographyWeight = "normal" | "medium" | "bold";

export interface TypographyProps
  extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  as?: ElementType; // allows HTML tag override if necessary
}

export const Typography = ({
  variant = "text",
  weight = "normal",
  as,
  className,
  children,
  ...props
}: TypographyProps) => {
  const Component = as || {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    lead: "p",
    text: "p",
    small: "p",
    xsmall: "p",
    xxsmall: "p",
  }[variant];

  const classes = [
    styles.typography,
    styles[`typography--${variant}`],
    styles[`typography--${weight}`],
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
