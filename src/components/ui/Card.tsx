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
    "site-card overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]",
    hover ? "site-card-hover transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)]" : "",
    className,
  ].join(" ");

  return <div {...props} className={classes}>{children}</div>;
}
