type CardProps = {
  children: React.ReactNode
  className?: string
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-zinc-800/70
        bg-zinc-900
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:border-zinc-700
        hover:-translate-y-1
        ${className}
      `}
    >
      {children}
    </div>
  )
}