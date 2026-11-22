# LearnHub Client

Next.js App Router frontend for LearnHub.

## Commands

- `npm run dev` — start development server
- `npm run build` — create a production build
- `npm run start` — run the production server
- `npm run lint` — run ESLint

## Environment

Copy `.env.example` to `.env.local`. Set `BETTER_AUTH_SECRET` to a secure random value of at least 32 characters. Configure `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_APP_URL` for deployed environments.

Better Auth uses `MONGODB_URI` and `MONGODB_DB_NAME` from this file. For local signup, run MongoDB locally or provide a MongoDB Atlas URI. Configure the same database in the server repository.

## Routes

- `/` — public home
- `/courses` — catalog
- `/courses/[id]` — course details
- `/login` and `/register` — authentication
- `/dashboard` — role-based dashboard
- `/profile` — profile
- `/payment-success` — Stripe redirect status
