import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { api, clearToken } from "../api";

const NAV = [
  { label: "Personal Investing", path: "/" },
  { label: "Watchlist", path: "/watchlist" },
  { label: "Ask AI", path: "/chat" },
  { label: "Retirement", path: "/retirement" },
  { label: "Finance", path: "/finance" },
  { label: "Budgeting", path: "/budgeting" },
];

export default function Layout() {
  const [drawer, setDrawer] = useState(false);
  const [profile, setProfile] = useState(false);
  const [email, setEmail] = useState("");
  const [holdings, setHoldings] = useState([]);
  const nav = useNavigate();

  function toggleProfile() {
    const next = !profile;
    setProfile(next);
    if (next) {
      api.profile().then((u) => setEmail(u.email)).catch(() => {});
      api.holdings().then((d) => setHoldings(d.holdings)).catch(() => {});
    }
  }
  function logout() { clearToken(); nav("/login"); }

  return (
    <div>
      <header className="navbar">
        <div className="nav-left">
          <button className="hamburger" onClick={() => setDrawer(true)}>☰</button>
          <span className="brand" onClick={() => nav("/")}>StockTrading</span>
        </div>
        <button className="profile-btn" onClick={toggleProfile}>👤</button>
      </header>

      {profile && (
        <div className="profile-panel">
          <p className="muted">Signed in as</p>
          <p className="pf-email">{email || "…"}</p>
          <hr />
          <p className="muted">Current holdings</p>
          {holdings.length === 0 ? (
            <p className="muted">None yet</p>
          ) : (
            holdings.map((h) => (
              <div key={h.ticker} className="pf-row">
                <span>{h.ticker}</span><span>{h.shares} sh</span>
              </div>
            ))
          )}
          <button className="sell full" onClick={logout}>Log out</button>
        </div>
      )}

      {drawer && (
        <>
          <div className="overlay" onClick={() => setDrawer(false)} />
          <nav className="drawer">
            <div className="drawer-head">Menu</div>
            {NAV.map((n) => (
              <Link key={n.path} to={n.path} className="drawer-item" onClick={() => setDrawer(false)}>
                {n.label}
              </Link>
            ))}
          </nav>
        </>
      )}

      <main><Outlet /></main>
    </div>
  );
}
