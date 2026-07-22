import { useState } from "react";

export default function TextField({ onChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-fields">
      <div className="field">
        <label className="field__label" htmlFor="email">Email</label>
        <span className="field__control">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
          </svg>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => { setEmail(event.target.value); onChange?.({ email: event.target.value, password }); }}
          />
        </span>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="password">Password</label>
        <span className="field__control">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); onChange?.({ email, password: event.target.value }); }}
          />
          <button
            className="field__reveal"
            type="button"
            aria-label={showPassword ? "Hide characters" : "Show characters"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </button>
        </span>
      </div>
    </div>
  );
}
