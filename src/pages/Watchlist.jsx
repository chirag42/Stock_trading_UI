import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const POLL_MS = 30000; // 30s — yfinance is delayed ~15min and rate-limited; 3s gets blocked

export default function Watchlist() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(null);
  const nav = useNavigate();

  async function load() {
    try { const d = await api.getWatchlist(); setItems(d.items); setUpdated(new Date()); }
    catch (e) { setError(e.message); }
  }
  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, []);

  async function add() {
    const t = query.trim().toUpperCase();
    if (!t) return;
    setError("");
    try { const d = await api.addWatchlist(t); setItems(d.items); setQuery(""); }
    catch (e) { setError(e.message); }
  }
  async function remove(t) {
    try { const d = await api.removeWatchlist(t); setItems(d.items); }
    catch (e) { setError(e.message); }
  }

  const filtered = items.filter((it) => it.ticker.includes(query.trim().toUpperCase()));

  return (
    <div className="page">
      <div className="header">
        <h1>Watchlist</h1>
        {updated && (
          <span className="muted">Updated {updated.toLocaleTimeString()} · auto-refresh 30s</span>
        )}
      </div>
      {error && <p className="error">{error}</p>}

      <div className="search-bar">
        <input
          className="search-input"
          placeholder="Search or add a ticker (e.g. AAPL)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button onClick={add}>Add</button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-card">
          {items.length === 0
            ? "Your watchlist is empty. Search a ticker above and click Add."
            : "No matching tickers."}
        </div>
      ) : (
        filtered.map((it) => (
          <div key={it.ticker} className="wl-row">
            <div className="wl-left" onClick={() => nav(`/stock/${it.ticker}`)}>
              <b>{it.ticker}</b>
            </div>
            <div className="wl-mid">
              {it.error ? (
                <span className="muted">unavailable</span>
              ) : (
                <>
                  <span className="wl-price">${it.price}</span>
                  <span className={it.change_pct >= 0 ? "pos change" : "neg change"}>
                    {it.change_pct >= 0 ? "▲" : "▼"} {Math.abs(it.change_pct)}%
                  </span>
                </>
              )}
            </div>
            <button className="sell" onClick={() => remove(it.ticker)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
}
