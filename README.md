# MoosclesPro

MoosclesPro is a focused workout tracking and logging app built around one simple loop:

**plan a workout → log every set → finish the session → learn from the history.**

## Product

- Dashboard with current training overview
- Reusable workout routines and ready-made programs
- Set-by-set logging for weight, reps and completion
- Previous-performance prefill when starting a routine
- Accurate workout and rest timers
- Resumable active workouts stored locally
- Completed workout history and session details
- Training statistics, volume and streaks
- Exercise library with search and filters
- Light and dark themes
- Responsive desktop and mobile layouts
- Session-based authentication and user-scoped MongoDB data

## Architecture

- **React + TypeScript + Vite** — browser application
- **Tailwind CSS** — shared responsive design system
- **Zustand** — active workout client state
- **Vercel Web API handlers** — HTTP/server boundary
- **Better Auth** — authentication and sessions
- **MongoDB Atlas** — accounts, routines and completed workout sessions

### Request and data flow

The browser talks to same-origin `/api/*` handlers. Better Auth reads and writes its users and sessions through the MongoDB adapter. Every routine and workout-session handler derives the owner from the authenticated Better Auth session; it does not trust a `userId` supplied by the browser. The dashboard and statistics handlers use the same user-scoped session query and compute their metrics from completed sets.

### Data model

| Collection | Purpose | Ownership and important fields |
| --- | --- | --- |
| Better Auth users and sessions | Account identity and persisted sign-in | Better Auth managed; sessions expire according to auth configuration |
| `routines` | Reusable user workout plans | `userId`, `id`, `name`, ordered exercises, `updatedAt` |
| `workoutSessions` | Completed workout history | `userId`, `routineId`, start and completion timestamps, exercises, sets, weight and reps |

Weights are stored in kilograms. The selected kg/lb preference is a display and input conversion preference, so changing units does not rewrite saved sessions. A session counts as a completed workout only when it has valid timestamps and at least one completed set. Volume is the sum of `weight × reps` for completed sets; duration comes from the session start and completion timestamps.

## Two-minute demonstration

1. Register a new account, sign out, then sign back in to show that the session persists across navigation and refresh.
2. Create a routine, add a few exercises, and reorder or edit them.
3. Start that routine, enter weights and reps, complete sets, and use the rest timer.
4. Finish the workout, open History, and confirm the routine, sets, volume, and duration were saved.
5. Return to the dashboard and Statistics and confirm their totals match the saved history. Switch to another account to demonstrate private data separation.

For a portfolio walkthrough, capture current screenshots of the dashboard, active workout, history, and mobile navigation after setting up sample data. Do not commit real user data or secrets in screenshots.

## Development

```bash
npm install
npm run dev
```

## Production checks

```bash
npm run lint
npm run build
```

## Deployment

Vercel serves the Vite application and the `api/` Web API handlers. Better Auth is mounted at `/api/auth/*`; MongoDB and authentication run on the Node.js runtime.

Set these variables in **Vercel → Project Settings → Environment Variables** for each deployment environment:

- `MONGODB_URI` — MongoDB Atlas connection string, including the database user and password.
- `BETTER_AUTH_SECRET` — a unique, random secret of at least 32 characters.
- `BETTER_AUTH_URL` — the canonical production origin, for example `https://your-domain.vercel.app`. Set the matching origin for Preview if you use preview deployments.

In MongoDB Atlas, ensure the database user has read/write access to the application database and the Atlas Network Access rules permit connections from your Vercel deployment. Never prefix these server secrets with `VITE_`.

The application uses Node 24 for CI and Vercel deployments.
