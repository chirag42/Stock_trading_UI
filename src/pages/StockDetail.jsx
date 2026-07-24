import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import ReactMarkdown from "react-markdown";
import { api } from "../api";

const RANGES = [
  { label: "1M", period: "1mo" },
  { label: "3M", period: "3mo" },
  { label: "6M", period: "6mo" },
  { label: "1Y", period: "1y" },
];
const SECTIONS = ["Chart", "AI Analysis", "News"];

export default function StockDetail() {
  const { ticker } = useParams();
  const nav = useNavigate();
  const [summary, setSummary] = useState(null);
  const [chart, setChart] = useState([]);
  const [range, setRange] = useState("3mo");
  const [news, setNews] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [section, setSection] = useState("Chart");
  const [shares, setShares] = useState(1);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.summary(ticker).then(setSummary).catch(() => {});
    api.news(ticker).then((d) => setNews(d.articles)).catch(() => {});
  }, [ticker]);

  useEffect(() => {
    api.chart(ticker, range).then((d) => setChart(d.points)).catch(() => {});
  }, [ticker, range]);

  async function runAnalysis() {
    setAnalyzing(true); setAnalysis(null); setMsg("");
    try { setAnalysis(await api.analysis(ticker)); }
    catch (e) { setMsg(e.message); }
    finally { setAnalyzing(false); }
  }
  async function buy() {
    setMsg("");
    try { await api.buy(ticker, Number(shares)); setMsg(`Bought ${shares} ${ticker}`); }
    catch (e) { setMsg(e.message); }
  }
  async function sell() {
    setMsg("");
    try { await api.sell(ticker, Number(shares)); setMsg(`Sold ${shares} ${ticker}`); }
    catch (e) { setMsg(e.message); }
  }

  return (
    <div className="page">
      <p className="link" onClick={() => nav("/")}>← Back</p>

      {/* Header with key stats */}
      <div className="stock-head">
        <div>
          <h1>{ticker}</h1>
          {summary && <div className="price">${summary.price}</div>}
        </div>
        {summary && (
          <div className="stats">
            <div className="stat">
              <span className="stat-label">RSI</span>
              <span className="stat-val">{summary.rsi} <em>{summary.rsi_signal}</em></span>
            </div>
            <div className="stat">
              <span className="stat-label">MACD</span>
              <span className="stat-val">{summary.macd} <em>{summary.macd_signal}</em></span>
            </div>
          </div>
        )}
      </div>

      {/* Buy / sell */}
      <div className="card">
        <div className="row">
          <input type="number" min="1" value={shares} onChange={(e) => setShares(e.target.value)} />
          <button onClick={buy}>Buy</button>
          <button className="sell" onClick={sell}>Sell</button>
          {msg && <span className="muted">{msg}</span>}
        </div>
      </div>

      {/* Two-column: side nav + content */}
      <div className="detail-layout">
        <div className="sidenav">
          {SECTIONS.map((s) => (
            <div
              key={s}
              className={section === s ? "sidenav-item active" : "sidenav-item"}
              onClick={() => setSection(s)}
            >
              {s}
            </div>
          ))}
        </div>

        <div className="detail-main">
          {section === "Chart" && (
            <div className="card">
              <div className="ranges">
                {RANGES.map((r) => (
                  <button
                    key={r.period}
                    className={range === r.period ? "range active" : "range"}
                    onClick={() => setRange(r.period)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chart}>
                  <XAxis dataKey="date" hide />
                  <YAxis domain={["auto", "auto"]} width={50} />
                  <Tooltip />
                  <Line type="monotone" dataKey="close" stroke="#2E75B6" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {section === "AI Analysis" && (
            <div>
              <button onClick={runAnalysis} disabled={analyzing}>
                {analyzing ? "Analyzing…" : "Run analysis"}
              </button>
              {analysis && (
                <div className="card">
                  <span className={`badge ${analysis.decision}`}>{analysis.decision}</span>
                  <div className="reasoning">
                    <ReactMarkdown>{analysis.reasoning}</ReactMarkdown>
                  </div>
                </div>
              )}
              {!analysis && !analyzing && (
                <p className="muted">Run the AI analysis to get a BUY/SELL/HOLD call with reasoning.</p>
              )}
            </div>
          )}

          {section === "News" && (
            news.length === 0 ? <p className="muted">No recent news.</p> :
            news.map((n, i) => (
              <a key={i} className="tile news" href={n.url} target="_blank" rel="noreferrer">
                {n.image && <img className="news-img" src={n.image} alt="" />}
                <div>
                  <b>{n.title}</b>
                  <div className="muted">{n.description}</div>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
