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
