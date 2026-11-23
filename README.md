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

## Deployment on Vercel

The Vercel project `rigrent-client` is linked to this independent repository. Set these Production (and Preview, if needed) environment variables in Vercel before deploying:

- `NEXT_PUBLIC_APP_URL` — deployed client origin.
- `NEXT_PUBLIC_API_URL` — deployed API origin.
- `BETTER_AUTH_URL` — same client origin as `NEXT_PUBLIC_APP_URL`.
- `BETTER_AUTH_SECRET` — long random secret.
- `MONGODB_URI` and `MONGODB_DB_NAME` — production MongoDB Atlas connection.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — optional until Google OAuth is enabled; configure its callback URL as `<client-origin>/api/auth/callback/google`.

Configure these values in Vercel Project Settings → Environment Variables; never commit credentials. Live frontend URL: **Not deployed yet**. Deploy with `vercel --prod` from this repository after configuring the values.
