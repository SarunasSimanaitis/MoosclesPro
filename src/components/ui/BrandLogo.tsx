import type { SVGProps } from "react";

type BrandLogoProps = SVGProps<SVGSVGElement> & {
  compact?: boolean;
};

/**
 * Flat, gradient-free MoosclesPro brand mark.
 * The angular M combines two bold strokes into a simple, legible symbol.
 */
export default function BrandLogo({
  compact = false,
  className = "",
  ...props
}: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 44 44"
        width={compact ? 34 : 38}
        height={compact ? 34 : 38}
        fill="none"
        role="img"
        aria-label="MoosclesPro"
        {...props}
      >
        <path d="M5 35V9L22 22L39 9V35H30V25L22 31L14 25V35H5Z" fill="currentColor" />
        <path d="M22 22L39 9V35H30V25L22 31V22Z" fill="#2563EB" />
      </svg>
      {!compact && (
        <span className="text-[1.05rem] font-black leading-none tracking-[-0.055em] text-[var(--text)] sm:text-[1.2rem]">
          MOOSCLES<span className="text-[var(--primary)]">PRO</span>
        </span>
      )}
    </span>
  );
}
