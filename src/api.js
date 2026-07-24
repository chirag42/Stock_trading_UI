const BASE = "http://localhost:8000";

export function getToken() { return localStorage.getItem("token"); }
export function setToken(t) { localStorage.setItem("token", t); }
export function clearToken() { localStorage.removeItem("token"); }

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(BASE + path, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  signup: (email, password) => request("/auth/signup", { method: "POST", body: JSON.stringify({ email, password }) }),
  login:  (email, password) => request("/auth/login",  { method: "POST", body: JSON.stringify({ email, password }) }),
  profile: () => request("/auth/profile"),
  opportunities: () => request("/opportunities"),
  holdings: () => request("/holdings"),
  getWatchlist: () => request("/watchlist"),
  addWatchlist: (t) => request(`/watchlist/${t}`, { method: "POST" }),
  removeWatchlist: (t) => request(`/watchlist/${t}`, { method: "DELETE" }),
  chart: (t, period = "3mo") => request(`/stocks/${t}/chart?period=${period}`),
  summary: (t) => request(`/stocks/${t}/summary`),
  news:  (t) => request(`/stocks/${t}/news`),
  analysis: (t) => request(`/stocks/${t}/analysis`),
  buy:  (ticker, shares) => request("/holdings/buy",  { method: "POST", body: JSON.stringify({ ticker, shares }) }),
  sell: (ticker, shares) => request("/holdings/sell", { method: "POST", body: JSON.stringify({ ticker, shares }) }),
};
