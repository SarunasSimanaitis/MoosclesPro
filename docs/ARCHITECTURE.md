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

The interface is flat and quiet: white (light) or true black (dark) surfaces separated by hairline borders, one blue accent taken from the logo, small 8–12px radii and system fonts. Every colour, radius and shadow is a CSS variable in `src/index.css`; components never hard-code colours.

Navigation:

- **Desktop / tablet (≥ 768px):** a fixed left sidebar. It shows icons only up to 1280px and icons with labels above that.
- **Phones:** a slim top bar (logo, Exercises, Mindset, theme) and a fixed bottom tab bar (Home, Workouts, History, Statistics, Profile).
- **Signed out:** a single top header with Log in / Sign up.

The bottom tab bar's height is exposed as `--bottom-offset` on `<html>` (class `has-bottom-nav`), so fixed and sticky elements (rest timer, routine builder save bar, active-workout bar) sit above it, including ones portalled to `<body>`.

While a workout is running, a slim "workout in progress" bar appears on every other page so it can be resumed in one tap. It is lazy-loaded, so it never adds to the first download.

## Workout logger

Every exercise of the workout is listed on one screen (like Hevy), each with a set table: Set · Previous · weight · reps · RPE · done. The bottom tab bar is hidden on this screen to leave room for logging.

- **Previous** comes from the routine's last completed session (`activeWorkout.previous`), captured when the workout starts. Tapping it copies those numbers.
- **RPE** is optional per set (6–10 in half steps) and validated on the server.
- **Skipping** an exercise collapses it; its unfinished sets stop counting toward progress, and it is left out of the saved session if nothing was done.
- **Rest per exercise** can be changed during the workout. The choice is stored in preferences under `routineId:exerciseId`, so it also works for premade routines.

### Rest timer

`restTimerStore` keeps only an end timestamp (persisted), so the countdown is correct after a refresh, after navigating away and after the phone was locked. `RestTimerWatcher`, mounted in the app shell, plays the end chime/vibration exactly once, wherever the user is. The timer is docked above the bottom edge (never draggable, so it can't get lost off screen); tapping it opens a full-screen ring timer with −15 s / +15 s / Skip.

Celebrations (confetti, toasts, check-mark pops) are skipped for users who prefer reduced motion.

## Client data rules

- Theme is one shared value (`useTheme`); every toggle reads and writes the same state, and `index.html` applies it before the first paint.
- Screens that can be opened directly and need a custom routine (the workout page, the active-workout bar) call `useCustomRoutines`, which loads the user's routines through the shared request cache.
- "Last time" pre-fill only uses sets that were completed in the previous session.
