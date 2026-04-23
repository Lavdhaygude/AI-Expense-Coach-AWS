import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Expense Coach",
  description: "AI-guided expense tracking and budgeting"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

