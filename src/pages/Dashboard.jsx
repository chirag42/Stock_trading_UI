import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Dashboard() {
  const [opps, setOpps] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    Promise.all([api.opportunities(), api.holdings()])
      .then(([o, h]) => { setOpps(o.opportunities); setHoldings(h.holdings); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const portfolioValue = holdings.reduce(
    (sum, h) => sum + (h.current_price || 0) * h.shares, 0
  );

  if (loading) return <div className="center">Loading…</div>;

  return (
    <div className="page">
      <h1>Personal Investing</h1>
      {error && <p className="error">{error}</p>}

      <div className="header">
        <h2>My Holdings</h2>
        {holdings.length > 0 && (
          <span className="muted">Total: ${portfolioValue.toFixed(2)}</span>
        )}
      </div>
      {holdings.length === 0 ? (
        <p className="muted">You don't own any stocks yet.</p>
      ) : (
        holdings.map((h) => (
          <div key={h.ticker} className="tile" onClick={() => nav(`/stock/${h.ticker}`)}>
            <div>
              <b>{h.ticker}</b> — {h.shares} shares @ ${h.avg_price}
              <div className="muted">
                Now ${h.current_price}{" "}
                <span className={h.pnl_pct >= 0 ? "pos" : "neg"}>
                  ({h.pnl_pct >= 0 ? "+" : ""}{h.pnl_pct}%)
                </span>
              </div>
            </div>
            <span className={`badge ${h.indicator}`}>{h.indicator}</span>
          </div>
        ))
      )}

      <h2>Opportunities</h2>
      {[...opps].sort((a,b) => (a.indicator==="BUY"?0:1)-(b.indicator==="BUY"?0:1)).map((o) => (
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
