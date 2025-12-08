"use client";

import {
  forwardRef,
  ButtonHTMLAttributes,
} from "react";
import styles from "./button.module.css";


export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" ;
  size?: "xxxs" | "xxs" | "xs" | "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      ...props
    },
    ref
  ) => {
    const classes = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
