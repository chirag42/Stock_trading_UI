# Stock Trading UI — Frontend

The user-facing app for the Agentic AI Stock Trading System. A simple React + Vite
single-page app: log in, browse BUY/WAIT opportunities and your SELL/HOLD holdings,
open a per-stock detail page (chart, AI analysis, news), manage a live watchlist, and
ask an AI assistant about your portfolio.

> **Simulation only.** No real money, brokerage, or payments. Not financial advice.

---

## 1. Where this fits

```
Frontend (this repo, :5173)
      │  HTTP  →  Backend middleware (:8000)  →  Research API (:8001)
```

The frontend talks only to the backend, at the URL set in `src/api.js`
(`BASE = "http://localhost:8000"`).

---

## 2. Prerequisites

| Requirement | Version used in development |
|-------------|-----------------------------|
| Node.js | v23.11.0 |
| npm | 10.9.2 |
| Backend API | must be running at http://localhost:8000 |

No API keys are needed in the frontend — all secrets live in the backend and research
services.

---

## 3. Setup & run

```bash
git clone https://github.com/chirag42/Stock_trading_UI.git
cd Stock_trading_UI

npm install            # installs exact versions from package-lock.json
npm run dev            # opens http://localhost:5173
```

`npm install` (no package name) reproduces the dependency tree from `package.json` +
`package-lock.json` — the frontend equivalent of a pinned requirements file.

---

## 4. Expected output / first use

1. Start all three services (research :8001, backend :8000, then this on :5173).
2. Open the printed URL (usually http://localhost:5173).
3. Sign up → you land on the dashboard.
4. Opportunities load (first load can be slow while the backend/research warm up).
5. Click a stock → Buy → it appears under "My Holdings".
6. Open a stock → "Run analysis" for the AI decision; open **Ask AI** to chat about
   your portfolio.

---

## 5. Features (by page)

| Page | What it does |
|------|--------------|
| Login / Signup | Auth with a simulation-only disclaimer; token stored in `localStorage` |
| Dashboard | Opportunities (BUY/WAIT, BUY-first) + Holdings (SELL/HOLD, day change, P/L) |
| Stock detail | Header stats; chart with 1M/3M/6M/1Y ranges; side-nav Chart / AI Analysis / News; Buy/Sell |
| Watchlist | Search + add (validated); live price + day change; 30s auto-refresh |
| Ask AI | Agentic chat grounded in your holdings/transactions/watchlist; Markdown-formatted replies |
| Coming Soon | Themed placeholders for Retirement / Finance / Budgeting |

---

## 6. Configuration

| What | Where |
|------|-------|
| Backend base URL | `src/api.js` → `BASE` (default `http://localhost:8000`) |
| Watchlist refresh interval | `src/pages/Watchlist.jsx` → `POLL_MS` (default 30000) |
| Auth token | Browser `localStorage`; "Log out" clears it |

---

## 7. Data handling

- The frontend stores only the **auth token** in `localStorage`. No portfolio or market
  data is persisted client-side beyond the current session's React state (including the
  Ask AI conversation history, which is sent with each request and held per browser).
- All data is fetched live from the backend; nothing sensitive is bundled in the app.

---

## 8. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Blank data / network errors | Backend not running | Start the backend at :8000 (and research at :8001) |
| CORS error in console | Backend origin not allowed | Ensure backend `CORS_ORIGINS` includes `http://localhost:5173` |
| Login works but data 401s | Token missing/expired | Log out and back in |
| Ask AI says it needs Claude | Backend `ANTHROPIC_API_KEY` unset | Set the key on the backend, restart it |
| Watchlist shows "unavailable" | yfinance rate limit upstream | Wait; 30s polling avoids hammering the source |
| Port 5173 in use | Another Vite app running | Vite will offer another port, or stop the other app |

---

## 9. Project structure

```
Stock_trading_UI/
├── index.html
├── package.json · package-lock.json · vite.config.js
├── src/
│   ├── main.jsx            # routes + auth guard
│   ├── api.js              # all backend calls + token
│   ├── styles.css
│   ├── components/Layout.jsx   # navbar, drawer, profile panel
│   └── pages/
│       ├── Login.jsx · Dashboard.jsx · StockDetail.jsx
│       ├── Watchlist.jsx · Chat.jsx · ComingSoon.jsx
└── README.md
```

**Build tooling:** Vite. Key libraries: react-router-dom (routing), recharts (charts),
react-markdown + remark-gfm (AI response formatting).

---

## 10. Disclaimer

Simulation only. No real trades, no real money, not financial advice.
