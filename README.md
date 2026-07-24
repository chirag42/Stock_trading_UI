# Stock Trading — Frontend (React + Vite)

Simple UI for the Stock Trading API: login, an Opportunities list (BUY/WAIT),
a Holdings list (SELL/HOLD), and a per-stock detail page (chart + buy/sell + AI
analysis + news).

## Prerequisites
- Node.js installed
- The backend API running at http://localhost:8000

## Setup & run
```bash
cd frontend
npm install
npm run dev
```
Then open the URL it prints (usually http://localhost:5173).

## Notes
- The API base URL is set in `src/api.js` (BASE = "http://localhost:8000").
- Your login token is stored in the browser (localStorage). "Log out" clears it.
- If calls fail with a CORS error, make sure the backend's CORS_ORIGINS includes
  http://localhost:5173 (it does by default).
