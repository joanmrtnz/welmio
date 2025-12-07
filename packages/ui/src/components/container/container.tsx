"use client";

import { HTMLAttributes } from "react";
import styles from "./container.module.css";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const Container = ({ className, children, ...props }: ContainerProps) => {
  const classes = [styles.container, className].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
