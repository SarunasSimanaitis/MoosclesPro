import Card from "./Card"

type StatCardProps = {
  label: string
  value: string
}

export default function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <Card>

      <p className="text-sm uppercase tracking-wider text-zinc-500">
        {label}
      </p>

      <h2 className="mt-4 text-4xl font-bold tracking-tight">
        {value}
      </h2>

    </Card>
  )
}