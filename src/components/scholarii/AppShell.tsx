import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/scholarii/auth";
import type { Role } from "@/lib/scholarii/types";
import {
  Home, Users, Briefcase, BookOpen, DollarSign, BarChart3, Megaphone, Settings,
  ClipboardCheck, ClipboardList, GraduationCap, CalendarClock, UserCircle, Building2,
  ShieldCheck, FileText, ScrollText, Calendar, Wallet, MessageSquare, Baby,
  LogOut, Bell, Moon, Sun, Search, Menu, X, BookMarked,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import scholariiIconUrl from "../../../Icons/scholarii-icon.png?url";

type NavItem = { to: string; label: string; icon: typeof Home };

const NAV: Record<Role, NavItem[]> = {
  principal: [
    { to: "/app", label: "Dashboard", icon: Home },
    { to: "/app/students", label: "Students", icon: Users },
    { to: "/app/teachers", label: "Teachers", icon: Briefcase },
    { to: "/app/academics", label: "Academic Overview", icon: BookOpen },
    { to: "/app/fees", label: "Fee Reports", icon: DollarSign },
    { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/app/announcements", label: "Announcements", icon: Megaphone },
    { to: "/app/settings", label: "Settings", icon: Settings },
  ],
  teacher: [
    { to: "/app", label: "Dashboard", icon: Home },
    { to: "/app/classes", label: "My Classes", icon: BookMarked },
    { to: "/app/attendance", label: "Attendance", icon: ClipboardCheck },
    { to: "/app/assignments", label: "Assignments", icon: ClipboardList },
    { to: "/app/gradebook", label: "Gradebook", icon: GraduationCap },
    { to: "/app/meetings", label: "PTA Meetings", icon: CalendarClock },
    { to: "/app/announcements", label: "Announcements", icon: Megaphone },
    { to: "/app/profile", label: "Profile", icon: UserCircle },
  ],
  student: [
    { to: "/app", label: "Dashboard", icon: Home },
    { to: "/app/timetable", label: "My Timetable", icon: Calendar },
    { to: "/app/assignments", label: "Assignments", icon: ClipboardList },
    { to: "/app/exams", label: "Exams & Results", icon: GraduationCap },
    { to: "/app/attendance", label: "Attendance", icon: ClipboardCheck },
    { to: "/app/fees", label: "Fees", icon: Wallet },
    { to: "/app/announcements", label: "Announcements", icon: Megaphone },
    { to: "/app/profile", label: "Profile", icon: UserCircle },
  ],
  admin: [
    { to: "/app", label: "Dashboard", icon: Home },
    { to: "/app/users", label: "User Management", icon: Users },
    { to: "/app/fees", label: "Fee Management", icon: DollarSign },
    { to: "/app/infrastructure", label: "Infrastructure", icon: Building2 },
    { to: "/app/reports", label: "Reports & Export", icon: FileText },
    { to: "/app/settings", label: "System Settings", icon: Settings },
    { to: "/app/logs", label: "Audit Logs", icon: ScrollText },
  ],
  parent: [
    { to: "/app", label: "Dashboard", icon: Home },
    { to: "/app/children", label: "My Children", icon: Baby },
    { to: "/app/attendance", label: "Attendance", icon: ClipboardCheck },
    { to: "/app/academics", label: "Academics", icon: BookOpen },
    { to: "/app/fees", label: "Fee Payments", icon: Wallet },
    { to: "/app/communication", label: "Communication", icon: MessageSquare },
    { to: "/app/events", label: "Events", icon: Calendar },
  ],
};

const ROLE_LABEL: Record<Role, string> = {
  principal: "Principal", teacher: "Teacher", student: "Student", admin: "Admin", parent: "Parent",
};

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, theme, toggleTheme } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;
  const items = NAV[user.role];
  const initials = user.name.split(" ").map((s) => s[0]).slice(0, 2).join("");

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-5 border-b border-sidebar-border">
        <div className="size-8 rounded-lg bg-card grid place-items-center shadow-soft">
          <img src={scholariiIconUrl} alt="Scholarii icon" className="size-5" />
        </div>
        <div>
          <div className="font-semibold text-sidebar-foreground leading-none">Scholarii</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">{ROLE_LABEL[user.role]} Portal</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {items.map((it) => {
          const active = it.to === "/app" ? path === "/app" : path.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-brand-gradient text-white shadow-glow"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4" />
              <span className="font-medium">{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={() => { logout(); nav({ to: "/login" }); }}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-sidebar border-r border-sidebar-border">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-sidebar border-r border-sidebar-border animate-in-up">
            {SidebarInner}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-4 lg:px-6 border-b border-border bg-background/80 backdrop-blur">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search students, teachers, classes..." className="pl-9 bg-muted/40 border-0" />
            </div>
          </div>
          <div className="flex-1 sm:hidden" />
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="size-5" />
            <Badge className="absolute -top-1 -right-1 size-4 p-0 grid place-items-center text-[10px] bg-brand-gradient border-0">3</Badge>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
                <Avatar className="size-9">
                  <AvatarFallback style={{ backgroundColor: user.avatarColor, color: "white" }}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground font-normal">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => nav({ to: "/app/profile" })}><UserCircle className="size-4 mr-2" />Profile</DropdownMenuItem>
              <DropdownMenuItem><Settings className="size-4 mr-2" />Settings</DropdownMenuItem>
              <DropdownMenuItem><ShieldCheck className="size-4 mr-2" />Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { logout(); nav({ to: "/login" }); }}>
                <LogOut className="size-4 mr-2" />Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 lg:p-8 animate-in-up">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, hint, tone = "default" }: {
  icon: typeof Home; label: string; value: string; hint?: string;
  tone?: "default" | "success" | "warning" | "info";
}) {
  const tones = {
    default: "from-brand-from to-brand-to",
    success: "from-emerald-400 to-emerald-600",
    warning: "from-amber-400 to-orange-500",
    info: "from-sky-400 to-blue-600",
  };
  return (
    <div className="glass rounded-2xl p-5 shadow-soft hover:-translate-y-0.5 transition-transform">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-3xl font-bold mt-2 tracking-tight">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
        </div>
        <div className={cn("size-11 rounded-xl grid place-items-center text-white bg-gradient-to-br", tones[tone])}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
