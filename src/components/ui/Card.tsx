import type {
  HTMLAttributes,
  ReactNode,
} from "react";

type CardProps =
  HTMLAttributes<HTMLDivElement> & {
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
        rounded-[var(--radius-xl)]
        border
        border-[var(--border)]
        bg-[var(--surface)]
        shadow-[var(--shadow-sm)]
        ${hover
          ? `
            transition-[transform,box-shadow,border-color]
            duration-200
            hover:-translate-y-0.5
            hover:border-[var(--border-strong)]
            hover:shadow-[var(--shadow-md)]
          `
          : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}