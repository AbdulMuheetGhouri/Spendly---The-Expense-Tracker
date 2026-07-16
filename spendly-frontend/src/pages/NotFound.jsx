import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="auth-shell">
      <div
        className="glass-strong"
        style={{
          padding: "48px 40px",
          textAlign: "center",
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Compass size={30} strokeWidth={1.8} />
        <h1 style={{ fontSize: "1.3rem" }}>Page not found</h1>
        <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem", margin: 0 }}>
          That page doesn't exist. Let's get you back on track.
        </p>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: 8 }}>
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
