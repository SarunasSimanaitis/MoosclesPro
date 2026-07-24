type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary"
}

export default function Button({
  children,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-indigo-500 hover:bg-indigo-400 text-white"
      : "bg-zinc-800 hover:bg-zinc-700 text-white"

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-2xl
        px-6
        py-3
        font-semibold
        transition-all
        duration-200
        hover:-translate-y-0.5
        active:scale-95
        ${styles}
      `}
    >
      {children}
    </button>
  )
}