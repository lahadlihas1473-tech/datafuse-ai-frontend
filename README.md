# Resource Paspoort — Frontend

React + Vite frontend for the Resource Paspoort Material & CO₂ Building Passport.
It calls the FastAPI backend's `/material-estimation/search` endpoint.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8)

## Local development

```bash
npm install
npm run dev
```

`npm run dev` reads `.env.development`, which points to the local backend
(`http://127.0.0.1:8000`). Start the backend first from the repo root:

```bash
uvicorn app.main:app --reload
```

## Environment variables

| Variable  | Description                                         | Example                   |
| --------- | --------------------------------------------------- | ------------------------- |
| `API_URL` | Base URL of the FastAPI backend, no trailing slash. | `https://api.example.com` |

Vite inlines `API_URL` (exposed via `envPrefix` in `vite.config.js`) **at build time**. After changing the value
in Vercel, redeploy for it to take effect. If it's missing, the app still
loads, but searches show "The API URL is not configured (API_URL)."

See `.env.example`. For local overrides, create `.env.local` (git-ignored).

## Deploying to Vercel

1. Import the repository in Vercel (**Add New → Project**).
2. Set **Root Directory** to `frontend`.
3. The framework preset (Vite), build command and output directory are read
   from `vercel.json`, so leave them at their defaults.
4. Under **Environment Variables**, add `API_URL` with the public HTTPS
   URL of the backend (for Production, and Preview if needed).
5. Deploy.

`vercel.json` also:

- rewrites all routes to `index.html`, so client-side routes and page
  reloads work (built files in `dist/` are still served directly);
- caches the hashed files in `/assets/` for one year.

### Backend requirements

The backend is deployed separately and must be:

- **Reachable over HTTPS.** An HTTPS page can't call an `http://` API.
- **Allowing the Vercel domain in CORS.** `app/main.py` currently allows only
  `http://localhost:5173` and `http://127.0.0.1:5173`. Add the production
  domain (e.g. `https://your-project.vercel.app`) to `allow_origins`. Preview
  deployments use different domains, which would also need to be allowed.

## Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the dev server                  |
| `npm run build`   | Production build into `dist/`         |
| `npm run preview` | Serve the production build locally    |
| `npm run lint`    | Lint with Oxlint                      |
