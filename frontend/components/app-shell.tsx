import Link from "next/link";
import { PropsWithChildren } from "react";
import { ProfileMenu } from "@/components/profile-menu";
import { SettingsInit } from "@/components/settings-init";
import { WelcomeBanner } from "@/components/welcome-banner";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/budgets", label: "Budgets" },
  { href: "/insights", label: "Insights" },
  { href: "/import", label: "Import" },
  { href: "/settings", label: "Settings" }
];

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="shell">
      <SettingsInit />
      <div className="layout shell-grid">
        <div className="hero">
          <div className="topbar">
            <div className="brand-mark">
              <p className="eyebrow">AI Expense Coach</p>
              <div className="nav-pills">
                {navItems.map((item) => (
                  <Link className="chip" key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="topbar-actions">
              <Link href="/signup" className="button">
                Create account
              </Link>
              <Link href="/login" className="button secondary">
                Sign in
              </Link>
              <ProfileMenu />
            </div>
          </div>
          <div className="hero-copy">
            <h1 className="title">A calmer way to understand your money.</h1>
            <p className="subtitle">
              Track spending, import statements, compare budgets, and let AI highlight what
              changed without taking control away from your real financial data.
            </p>
          </div>
          <div className="hero-highlights">
            <div className="hero-stat">
              <p className="eyebrow">Live Dashboard</p>
              <strong>Imported transactions drive your cards, trends, and coaching.</strong>
            </div>
            <div className="hero-stat">
              <p className="eyebrow">Budget Flow</p>
              <strong>Create category targets and see how actuals stack up instantly.</strong>
            </div>
            <div className="hero-stat">
              <p className="eyebrow">AI Layer</p>
              <strong>Summaries and category suggestions stay grounded in your real numbers.</strong>
            </div>
          </div>
          <WelcomeBanner />
        </div>
        {children}
      </div>
    </div>
  );
}
