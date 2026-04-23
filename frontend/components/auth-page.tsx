import Link from "next/link";
import { ReactNode } from "react";

type AuthPageProps = {
  title: string;
  subtitle: string;
  eyebrow: string;
  alternateHref: string;
  alternateLabel: string;
  alternateText: string;
  children: ReactNode;
};

export function AuthPage({
  title,
  subtitle,
  eyebrow,
  alternateHref,
  alternateLabel,
  alternateText,
  children
}: AuthPageProps) {
  return (
    <div className="auth-shell">
      <div className="auth-wrap">
        <section className="auth-brand">
          <p className="eyebrow">AI Expense Coach</p>
          <h1 className="title" style={{ fontSize: "clamp(2.8rem, 5vw, 4.8rem)" }}>
            Financial clarity with a dedicated sign-in flow.
          </h1>
          <p className="subtitle">
            Access your dashboard, budgets, imported statements, and AI summaries from a
            focused authentication experience instead of the main app shell.
          </p>
          <div className="hero-highlights">
            <div className="hero-stat">
              <p className="eyebrow">Secure session</p>
              <strong>Email and password login with dashboard redirect.</strong>
            </div>
            <div className="hero-stat">
              <p className="eyebrow">After sign in</p>
              <strong>You land directly back on the dashboard.</strong>
            </div>
          </div>
          <div className="auth-links">
            <Link className="button secondary" href="/dashboard">
              Back to dashboard
            </Link>
            <Link className="button secondary" href="/">
              Home
            </Link>
          </div>
        </section>

        <section className="auth-card">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 style={{ margin: "8px 0 10px", fontSize: "3rem" }}>{title}</h2>
            <p className="auth-note">{subtitle}</p>
          </div>
          {children}
          <p className="auth-note">
            {alternateText}{" "}
            <Link href={alternateHref} style={{ color: "var(--accent)", fontWeight: 700 }}>
              {alternateLabel}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

