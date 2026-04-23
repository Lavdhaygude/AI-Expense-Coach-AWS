"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { clearStoredUser, readStoredUser } from "@/lib/user-session";

export function ProfileMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const user = readStoredUser();
    setName(user?.fullName ?? "Guest User");
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  async function handleLogout() {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } finally {
      clearStoredUser();
      setOpen(false);
      router.push("/login");
      router.refresh();
    }
  }

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "GU";

  return (
    <div className="profile-wrap" ref={menuRef}>
      <button className="profile-button" onClick={() => setOpen((value) => !value)} type="button">
        <span className="avatar">{initials}</span>
        <span>
          <strong>{name}</strong>
        </span>
      </button>

      {open ? (
        <div className="profile-menu">
          <Link className="menu-item" href="/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <Link className="menu-item" href="/settings" onClick={() => setOpen(false)}>
            Settings
          </Link>
          <button className="menu-item" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
