import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "../api";
import remarkGfm from "remark-gfm";


const SUGGESTIONS = [
  "How are my holdings doing?",
  "Which of my stocks looks riskiest?",
  "Summarize my portfolio.",
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(text) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const { answer } = await api.chat(msg, history);
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: `⚠️ ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page chat-page">
      <h1>Ask AI</h1>
      <p className="muted">Ask about your portfolio and watchlist. Simulation only — not financial advice.</p>

      <div className="chat-window">
        {messages.length === 0 && (
          <div className="chat-suggest">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
          </div>
        ))}
        {loading && <div className="bubble assistant muted">Thinking…</div>}
        <div ref={endRef} />
      </div>

      <div className="chat-input">
        <input
          placeholder="Ask something about your portfolio…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={() => send()} disabled={loading}>Send</button>
      </div>
    </div>
  );
}
