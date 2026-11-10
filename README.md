# LOUFHUB

A full-stack starter for a Movies, Music and Football platform.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Python + FastAPI + SQLAlchemy
- Database: PostgreSQL (SQLite fallback for local development)
- Movie metadata: TMDB
- Sports data: configurable provider adapter (API-Football-compatible placeholder)
- Music: provider adapter placeholder; connect a licensed provider before streaming

> This is a runnable foundation, not a production-ready streaming service. TMDB supplies metadata, not movie files or streaming rights. Live match video and downloads require authorized providers. Sports data requires a valid provider API key.

## Requirements
- Python 3.11+
- Node.js 20+
- npm
- PostgreSQL (optional for local demo; SQLite is used if DATABASE_URL is not set)

## 1. Backend setup (Windows PowerShell)
```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```
API docs: http://127.0.0.1:8000/docs

## 2. Frontend setup
Open another terminal:
```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```
Open http://localhost:5173

## 3. Configure APIs
Edit `backend/.env`:
- `TMDB_API_KEY`: create a key using https://www.themoviedb.org/settings/api
- `SPORTS_API_KEY`: key from your chosen football data provider
- `DATABASE_URL`: optional PostgreSQL connection string

Never put private API keys in frontend files or commit `.env`.

## Current implementation (UI phase)
- Responsive dark LOUFHUB interface with sidebar navigation and mobile menu
- Home, Movies, Music, Football and My Library views
- TMDB popular movie cards, loading state, error state and movie detail modal
- Global search form connected to the FastAPI search endpoint
- Music discovery sample rows (not playable until a licensed provider is integrated)
- Football match-center layout with clearly labelled sample fixtures (not live data)
- Provider connection notices and authorized-streaming guidance

The frontend is an implemented first phase. Authentication, persistent library features, real music playback and live football feeds remain future integration work. The frontend build was not verified in this environment because dependency installation did not finish; run `npm install` and `npm run build` locally to verify it.

## Next implementation steps
1. Add database migrations and persistent user accounts.
2. Select and configure a licensed music provider.
3. Select a football data provider and implement its fixtures, results, standings and live endpoints.
4. Add authenticated user library, favorites and watch history.
5. Add authorized video/audio playback integrations.
6. Add tests, production security settings and deployment configuration.

## Copyright and provider limitations
- Do not scrape or embed unauthorized movie/music streams.
- Do not bypass DRM, subscriptions, geographic restrictions or access controls.
- Only expose downloads where the rights holder/provider permits them.
- Show live scores only when supplied by a configured sports data provider.

## React-only edition

The repository root also contains a standalone React + TypeScript + Vite edition, with a second copy in `LOUFHUB-REACT/`. It does not use the Python backend described above. To run the root-level edition:

```powershell
npm install
npm run dev
```

Set `VITE_TMDB_API_KEY` in a local root `.env` file to enable TMDB requests. Values prefixed with `VITE_` are included in browser code and are visible to visitors; never place private tokens or passwords there. The standalone app uses licensed provider links and previews rather than hosting full movie or music streams.
