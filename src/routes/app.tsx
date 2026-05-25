import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/scholarii/auth";
import { AppShell } from "@/components/scholarii/AppShell";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { user } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (user === null) {
    // wait one tick; auth loads from localStorage on mount
    const t = setTimeout(() => { if (!localStorage.getItem("scholarii-user-v1")) nav({ to: "/login" }); }, 50);
    return () => clearTimeout(t);
  } }, [user, nav]);

  if (!user) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>;
  }
  return <AppShell><Outlet /></AppShell>;
}
