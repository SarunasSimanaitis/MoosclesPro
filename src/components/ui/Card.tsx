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
  return (
    <div
      {...props}
      className={`
        overflow-hidden
        rounded-[var(--radius-xl)]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        ${hover ? "transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)]" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
