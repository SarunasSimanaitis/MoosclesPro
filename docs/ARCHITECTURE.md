# MoosclesPro architecture

## Runtime boundaries

- `src/` is the browser application.
- `api/` contains Vercel Web API handlers and is the only HTTP boundary.
- `src/lib/auth.ts` and `src/lib/mongodb.ts` are server-only modules used by API handlers.
- `src/api/` contains typed browser API clients; it never accesses MongoDB directly.
- `src/data/` contains static exercise/program definitions.
- `src/stores/` contains client state that must survive navigation, especially an active workout.
- `src/lib/workoutEngine.ts` contains pure workout-domain calculations and transformations.

## Workout lifecycle

1. A routine is a reusable workout plan: exercise order, target sets/reps and rest.
2. Starting a routine creates an active workout snapshot with its own set IDs.
3. Set edits update only the active workout and persist locally through Zustand.
4. When a routine has history, the last logged weight/reps are used as starting values.
5. Finishing converts the active workout into an immutable workout session and sends it to the API.
6. Completed sessions are the source for history, statistics, streaks and volume.
7. The active workout is cleared only after the server confirms the session was saved.

## Performance principles

- Route-level React lazy loading keeps initial JS smaller.
- MongoDB indexes cover user history/routine sorting and latest-session lookups.
- History responses are capped at a sensible client-facing limit.
- The browser does not fetch Mongo data directly.
- Pure workout calculations stay outside React components.
- Mobile and desktop share the same component system instead of maintaining separate navigation shells.

## UI system

Light mode uses a milky off-white base, warm gold as the primary accent, soft green for positive progress and red for warnings.

Dark mode uses an obsidian-black base, clean white typography, warm gold for primary actions, soft green for encouragement and red for warnings.

The primary navigation is always at the top. Desktop and mobile use the same navigation model; mobile collapses secondary links into a top menu rather than adding a second bottom navigation system.

The workout logger is intentionally touch-first: large controls, readable spacing, concise labels and no dense spreadsheet-style layout on small screens.
