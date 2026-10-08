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

The project is intentionally split into clear boundaries:

- **React + TypeScript + Vite** — browser application
- **Tailwind CSS** — shared responsive design system
- **Zustand** — active workout client state
- **Vercel Web API handlers** — HTTP/server boundary
- **Better Auth** — authentication and sessions
- **MongoDB** — routines and immutable completed workout sessions

See `docs/ARCHITECTURE.md` for the detailed domain and runtime model.

## Development

NaN

Production checks:

NaN

The GitHub Actions quality check runs the same lint/build validation against pull requests.

## Deployment

Vercel serves the Vite application and the `api/` Web API handlers. Better Auth is mounted at `/api/auth/*` using a catch-all route, while the Node runtime is used for MongoDB and authentication.

Required environment variables:

- `MONGODB_URI`
- `BETTER_AUTH_SECRET`

The application uses Node 24 for CI and Vercel deployments.