"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { saveStoredUser } from "@/lib/user-session";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload =
      mode === "signup"
        ? {
            fullName: String(formData.get("fullName") ?? ""),
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? "")
          }
        : {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? "")
          };

    try {
      const response = await fetch(`${API_URL}/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({ message: "Request failed" }));
        throw new Error(body.message ?? "Request failed");
      }

      const body = (await response.json()) as {
        user: {
          id: number;
          fullName: string;
          email: string;
          role: string;
        };
      };

      saveStoredUser(body.user);
      setMessage(
        mode === "signup" ? "Account created. You can open the dashboard." : "Signed in successfully."
      );
      form.reset();
      if (typeof window !== "undefined") {
        window.alert(`Welcome, ${body.user.fullName}!`);
      }
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      {mode === "signup" ? (
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" name="fullName" type="text" placeholder="Asha Lee" />
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" placeholder="Password" />
      </div>

      <button className="button" disabled={loading} type="submit">
        {loading ? "Working..." : mode === "signup" ? "Create account" : "Login"}
      </button>

      {message ? (
        <div className="metric-card" style={{ padding: 16 }}>
          {message}
        </div>
      ) : null}
    </form>
  );
}
