import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Role, User } from "./types";

const KEY = "scholarii-user-v1";
const THEME_KEY = "scholarii-theme";

export const DEMO_USERS: Record<Role, { email: string; name: string; color: string }> = {
  principal: { email: "principal@school.com", name: "Dr. Asha Verma", color: "#667eea" },
  teacher: { email: "teacher@school.com", name: "Rajesh Kumar", color: "#764ba2" },
  student: { email: "student@school.com", name: "Aarav Sharma", color: "#10b981" },
  admin: { email: "admin@school.com", name: "Priya Mehta", color: "#f59e0b" },
  parent: { email: "parent@school.com", name: "Suresh Sharma", color: "#3b82f6" },
};

export const DEMO_PASSWORD = "demo123";

interface AuthCtx {
  user: User | null;
  login: (email: string, password: string, role: Role) => { ok: boolean; error?: string };
  logout: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
      const t = (localStorage.getItem(THEME_KEY) as "light" | "dark") || "light";
      setTheme(t);
      document.documentElement.classList.toggle("dark", t === "dark");
    } catch {}
  }, []);

  const login: AuthCtx["login"] = (email, password, role) => {
    const demo = DEMO_USERS[role];
    if (!demo) return { ok: false, error: "Invalid role" };
    if (email.trim().toLowerCase() !== demo.email || password !== DEMO_PASSWORD) {
      return { ok: false, error: "Invalid credentials. Use the demo credentials shown." };
    }
    const u: User = { email: demo.email, name: demo.name, role, avatarColor: demo.color };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return <Ctx.Provider value={{ user, login, logout, theme, toggleTheme }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}
