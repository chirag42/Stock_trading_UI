import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const POLL_MS = 30000; // auto-refresh every 30s

export default function Dashboard() {
  const [opps, setOpps] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(null);
  const nav = useNavigate();

  async function load() {
    try {
      const [o, h] = await Promise.all([api.opportunities(), api.holdings()]);
      setOpps(o.opportunities); setHoldings(h.holdings); setUpdated(new Date());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, []);

  const portfolioValue = holdings.reduce(
    (sum, h) => sum + (h.current_price || 0) * h.shares, 0
  );

  if (loading) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <div className="header">
        <h1>Personal Investing</h1>
        {updated && <span className="muted">Updated {updated.toLocaleTimeString()} · auto-refresh 30s</span>}
      </div>
      {error && <p className="error">{error}</p>}

      <div className="header">
        <h2>My Holdings</h2>
        {holdings.length > 0 && <span className="muted">Total: ${portfolioValue.toFixed(2)}</span>}
      </div>
      {holdings.length === 0 ? (
        <p className="muted">You don't own any stocks yet.</p>
      ) : (
        holdings.map((h) => (
          <div key={h.ticker} className="tile" onClick={() => nav(`/stock/${h.ticker}`)}>
            <div>
              <b>{h.ticker}</b> — {h.shares} shares @ ${h.avg_price}
              <div className="muted">
                Now ${h.current_price}
                {h.change_pct != null && (
                  <span className={h.change_pct >= 0 ? "pos" : "neg"}>
                    {" "}{h.change_pct >= 0 ? "▲" : "▼"} {Math.abs(h.change_pct)}% today
                  </span>
                )}
                {" · "}
                <span className={h.pnl_pct >= 0 ? "pos" : "neg"}>
                  P/L {h.pnl_pct >= 0 ? "+" : ""}{h.pnl_pct}%
                </span>
              </div>
            </div>
            <span className={`badge ${h.indicator}`}>{h.indicator}</span>
          </div>
        ))
      )}

      <h2>Opportunities</h2>
      {[...opps].sort((a, b) => (a.indicator === "BUY" ? 0 : 1) - (b.indicator === "BUY" ? 0 : 1)).map((o) => (
        <div key={o.ticker} className="tile" onClick={() => nav(`/stock/${o.ticker}`)}>
          <div>
            <b>{o.ticker}</b>
            <div className="muted">${o.price} · RSI {o.rsi}</div>
          </div>
          <span className={`badge ${o.indicator}`}>{o.indicator}</span>
        </div>
      ))}
    </div>
  );
}
