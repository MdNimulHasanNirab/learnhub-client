# RigRent Client

Responsive Equipment Rental Platform frontend built with Next.js App Router, React, Tailwind CSS, DaisyUI and Framer Motion.

## Features

- Animated marketplace home page, backend-driven equipment search/filter/sort, and private equipment details.
- Better Auth email/password and optional Google login; customer, owner and admin workspaces.
- Favorites, date/quantity booking, Stripe Checkout return pages, ImgBB upload forms and profile editing.
- Responsive layouts, empty/error/loading states and dynamic dashboard statistics.

## Local development

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `MONGODB_URI`, and `MONGODB_DB_NAME`. Set Google OAuth credentials to enable Google login. Use a strong random Better Auth secret. Keep `.env.local` out of Git.

The local frontend runs at `http://localhost:3000`; the API defaults to `http://localhost:5000`.

## Scripts

- `npm run dev` — local development server.
- `npm run build` — production build.
- `npm run start` — serve the production build.
- `npm run lint` — ESLint checks.

## Deployment

Live frontend URL: **Not deployed**. Configure production auth origins and server API URL after selecting a hosting account. See [`../docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md).
