import Card from "../ui/Card"
import ProgressBar from "../ui/ProgressBar"

export default function HeroCard() {
  return (
    <Card className="overflow-hidden">

      <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
        Current Level
      </p>

      <h1 className="mt-5 text-7xl font-black tracking-tight">
        8
      </h1>

      <p className="mt-2 text-xl font-semibold text-indigo-400">
        Disciplined
      </p>

      <ProgressBar
        value={720}
        max={1000}
      />

      <div className="mt-4 flex justify-between text-sm text-zinc-500">

        <span>720 XP</span>

        <span>1000 XP</span>

      </div>

    </Card>
  )
}