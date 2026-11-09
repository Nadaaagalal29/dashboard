import { useState } from "react";
import { ArrowRight, Car } from "lucide-react";
import { useApp } from "../context/WorkspaceContext.jsx";

export function Login() {
  const { setUser } = useApp();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    let f = new FormData(e.target);
    if (String(f.get("password")).length < 6)
      return setError("Enter a password with at least 6 characters.");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 300));
    const u = {
      name: String(f.get("email")).split("@")[0],
      email: f.get("email"),
    };
    sessionStorage.setItem("orbit-user", JSON.stringify(u));
    setUser(u);
  }
  return (
    <div className="login">
      <section className="login-art">
        <div className="brand">
          <Car /> CarLink
        </div>
        <div>
          <span className="eyebrow">A LITTLE CLARITY. A LOT OF PROGRESS.</span>
          <h1>
            Great work starts
            <br />
            with a clear plan.
          </h1>
          <p>Bring your projects, people, and possibilities together.</p>
          <div className="orbit-art">
            <div />
            <div />
            <span>✦</span>
          </div>
        </div>
        <small>Your next big thing starts here.</small>
      </section>
      <section className="login-form">
        <div>
          <div className="login-logo">
            <Car /> CarLink
          </div>
          <h2>Welcome Back!</h2>
          <p>Sign in to your account</p>
          <form onSubmit={submit}>
            <label>
              Email address
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                placeholder="At least 6 characters"
                minLength={6}
                required
                autoComplete="current-password"
              />
            </label>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button className="primary wide" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
              <ArrowRight size={18} />
            </button>
          </form>
          <div className="demo-note">
            Demo workspace · Use any email and a password of 6+ characters.
            Authentication is simulated.
          </div>
        </div>
      </section>
    </div>
  );
}
