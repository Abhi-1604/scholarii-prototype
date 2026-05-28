import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useAuth, DEMO_USERS, DEMO_PASSWORD } from "@/lib/scholarii/auth";
import type { Role } from "@/lib/scholarii/types";
import { toast } from "sonner";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Scholarii" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("principal");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) nav({ to: "/app" }); }, [user, nav]);

  const fillDemo = (r: Role) => {
    setRole(r);
    setEmail(DEMO_USERS[r].email);
    setPassword(DEMO_PASSWORD);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password, role);
      setLoading(false);
      if (!res.ok) { toast.error(res.error || "Login failed"); return; }
      toast.success(`Welcome, ${DEMO_USERS[role].name.split(" ")[0]}!`);
      nav({ to: "/app" });
    }, 300);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden lg:flex items-center justify-center bg-brand-gradient text-white overflow-hidden p-12">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 size-80 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 size-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="size-9 rounded-lg bg-white/15 backdrop-blur grid place-items-center font-bold">S</div>
            <span className="font-semibold text-xl">Scholarii</span>
          </Link>
          <h2 className="text-4xl font-bold leading-tight">One platform.<br />Every role.</h2>
          <p className="mt-4 text-white/80">Principal, teacher, student, admin or parent — sign in with your role and get a workspace built for the job.</p>
          <div className="mt-10 space-y-3">
            {(Object.keys(DEMO_USERS) as Role[]).map((r) => (
              <div key={r} className="flex items-center gap-3 text-sm">
                <ShieldCheck className="size-4 text-white/80" />
                <span className="capitalize">{r} dashboard</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="size-8 rounded-lg bg-brand-gradient grid place-items-center text-white font-bold">S</div>
            <span className="font-semibold">Scholarii</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-1.5">Sign in to continue to your dashboard.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="principal">Principal</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input className="pl-9" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@school.com" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input className="pl-9" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                <span>Remember me</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Password reset is demo-only."); }} className="text-primary hover:underline">Forgot password?</a>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-brand-gradient text-white border-0 hover:opacity-90 shadow-glow">
              {loading ? "Signing in..." : (<>Sign in <ArrowRight className="size-4 ml-1" /></>)}
            </Button>
          </form>

          <Card className="mt-6 p-4 border-dashed">
            <div className="text-xs font-medium text-muted-foreground mb-2">Demo credentials — click to fill</div>
            <div className="grid grid-cols-1 gap-1.5">
              {(Object.keys(DEMO_USERS) as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => fillDemo(r)}
                  className="flex items-center justify-between text-xs px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
                >
                  <span className="capitalize font-medium">{r}</span>
                  <span className="font-mono text-muted-foreground">{DEMO_USERS[r].email}</span>
                </button>
              ))}
              <div className="text-[11px] text-muted-foreground mt-1">Password for all: <span className="font-mono">{DEMO_PASSWORD}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
