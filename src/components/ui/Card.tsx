import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hover?: boolean;
};

export default function Card({
  children,
  className = "",
  hover = false,
  ...props
}: CardProps) {
  const classes = [
    "site-card overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]",
    hover ? "site-card-hover" : "",
    className,
  ].join(" ");

  return <div {...props} className={classes}>{children}</div>;
}
