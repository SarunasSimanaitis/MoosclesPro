import { NavLink } from "react-router-dom";
import { navigation } from "../../data/navigation";

export default function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col overflow-y-auto border-r border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 px-8 py-8">
        <h1 className="text-3xl font-black tracking-tight text-zinc-50">
          Mooscles
          <span className="text-indigo-400">Pro</span>
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Train with consistency.
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-5">
        {navigation.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `
                group flex items-center gap-3
                rounded-2xl
                border
                px-4
                py-3
                transition-all
                duration-200

                ${
                  isActive
                    ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-300"
                    : "border-transparent text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100"
                }
              `
              }
            >
              <Icon
                size={20}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />

              <span className="font-medium">
                {link.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg shadow-black/10">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Current Level
          </p>

          <h2 className="mt-3 text-4xl font-bold text-zinc-50">
            1
          </h2>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full w-[15%] rounded-full bg-indigo-500 transition-all duration-700" />
          </div>

          <p className="mt-3 text-sm text-zinc-400">
            15 / 100 XP
          </p>
        </div>
      </div>
    </aside>
  );
}