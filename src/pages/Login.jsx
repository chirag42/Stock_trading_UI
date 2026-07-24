import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken } from "../api";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const fn = isSignup ? api.signup : api.login;
      const { access_token } = await fn(email, password);
      setToken(access_token);
      nav("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="center">
      <form className="card auth" onSubmit={submit}>
        <h2>{isSignup ? "Sign up" : "Log in"}</h2>
        {error && <p className="error">{error}</p>}
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password (min 8 chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">{isSignup ? "Create account" : "Log in"}</button>
        <p className="link" onClick={() => { setIsSignup(!isSignup); setError(""); }}>
          {isSignup ? "Have an account? Log in" : "New here? Sign up"}
        </p>
        <p className="disclaimer">
          Simulation only. This app uses simulated trades with no real money,
          brokerage, or payments. Nothing here is financial advice.
        </p>
      </form>
    </div>
  );
}
