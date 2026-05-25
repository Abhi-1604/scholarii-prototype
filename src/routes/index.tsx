import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  GraduationCap, Wallet, ClipboardCheck, MessageSquare, ArrowRight, Check,
  Sparkles, Shield, Zap, Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scholarii — Replace Excel & WhatsApp for your school" },
      { name: "description", content: "India's simplest school management system. Manage fees, attendance, parent communication and more from one beautiful dashboard." },
    ],
  }),
  component: Landing,
});

const schema = z.object({
  schoolName: z.string().min(2, "School name is required").max(120),
  name: z.string().min(2, "Your name is required").max(80),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, "Enter a valid Indian phone number"),
  students: z.string().min(1, "Select student range"),
  challenge: z.string().min(1, "Select your biggest challenge"),
  current: z.string().min(1, "Select current system"),
  date: z.string().optional(),
  time: z.string().optional(),
  message: z.string().max(500).optional(),
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <DemoForm />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border/60">
      <div className="max-w-7xl mx-auto h-16 px-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-brand-gradient grid place-items-center text-white font-bold">S</div>
          <span className="font-semibold text-lg">Scholarii</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#demo" className="hover:text-foreground">Book a Demo</a>
          <Link to="/login" className="hover:text-foreground">Login</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
          <a href="#demo"><Button size="sm" className="bg-brand-gradient text-white border-0 hover:opacity-90">Book a Demo</Button></a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-32 size-[480px] rounded-full bg-brand-gradient opacity-20 blur-3xl" />
        <div className="absolute top-40 -left-32 size-[420px] rounded-full bg-brand-gradient opacity-15 blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-5 pt-16 pb-20 lg:pt-24 lg:pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium mb-6 animate-in-up">
          <Sparkles className="size-3.5 text-primary" />
          Trusted by 500+ schools across India
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1] animate-in-up">
          Replace Excel & WhatsApp <br />with <span className="text-brand-gradient">Scholarii</span>.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-in-up">
          India's simplest school management system. Beautiful dashboards for principals, teachers, students, admins and parents — all in one place.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 animate-in-up">
          <a href="#demo"><Button size="lg" className="bg-brand-gradient text-white border-0 hover:opacity-90 shadow-glow">Book a Demo <ArrowRight className="size-4 ml-1" /></Button></a>
          <Link to="/login"><Button size="lg" variant="outline">Try Free Demo</Button></Link>
        </div>
        <div className="mt-16 mx-auto max-w-5xl glass rounded-3xl p-3 shadow-glow animate-in-up">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-muted/40 to-background aspect-[16/9] grid place-items-center border border-border/60">
            <DashboardMock />
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardMock() {
  const cards = [
    { label: "Students", value: "1,248", tone: "from-violet-500 to-fuchsia-500" },
    { label: "Attendance", value: "94%", tone: "from-emerald-400 to-teal-500" },
    { label: "Fee Today", value: "₹86K", tone: "from-amber-400 to-orange-500" },
    { label: "Teachers", value: "62", tone: "from-sky-400 to-blue-500" },
  ];
  return (
    <div className="w-full h-full p-6 grid grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl bg-card shadow-soft p-4 border border-border/60">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{c.label}</div>
          <div className="text-2xl font-bold mt-1">{c.value}</div>
          <div className={`h-1.5 mt-3 rounded-full bg-gradient-to-r ${c.tone}`} />
        </div>
      ))}
      <div className="col-span-4 rounded-2xl bg-card shadow-soft p-4 border border-border/60 h-32 flex items-end gap-2">
        {[40, 65, 50, 80, 70, 90, 75, 95].map((h, i) => (
          <div key={i} className="flex-1 rounded-md bg-brand-gradient" style={{ height: `${h}%`, opacity: 0.6 + i * 0.05 }} />
        ))}
      </div>
    </div>
  );
}

function Stats() {
  const stats = [
    { v: "60%", l: "Time saved every week" },
    { v: "95%", l: "Parent satisfaction" },
    { v: "500+", l: "Schools trust Scholarii" },
  ];
  return (
    <section className="py-16 border-y border-border/60 bg-muted/30">
      <div className="max-w-5xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="text-4xl md:text-5xl font-bold text-brand-gradient">{s.v}</div>
            <div className="text-sm text-muted-foreground mt-2">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Wallet, title: "Fee Management", desc: "Track payments, send reminders, generate receipts in seconds. UPI, card, and cash supported." },
    { icon: ClipboardCheck, title: "Attendance Tracking", desc: "One-tap class attendance. Auto-notify parents. Visual reports principals will love." },
    { icon: MessageSquare, title: "Parent Communication", desc: "Stop chasing WhatsApp groups. Announcements, PTA meetings and messages in one inbox." },
  ];
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything your school needs.</h2>
          <p className="text-muted-foreground mt-3">Beautiful, fast, and built for Indian schools. No setup headaches.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <Card key={f.title} className="p-7 hover:shadow-glow transition-shadow border-border/60">
              <div className="size-12 rounded-xl bg-brand-gradient grid place-items-center text-white mb-5">
                <f.icon className="size-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
        <div className="mt-16 grid sm:grid-cols-3 gap-6 text-sm">
          {[
            { icon: Shield, t: "Secure by default", d: "Role-based access and audit logs." },
            { icon: Zap, t: "Lightning fast", d: "Built for low-bandwidth Indian networks." },
            { icon: Users, t: "Loved by parents", d: "Real-time updates and easy fee payments." },
          ].map((x) => (
            <div key={x.t} className="flex items-start gap-3">
              <div className="size-9 shrink-0 rounded-lg bg-accent grid place-items-center text-accent-foreground">
                <x.icon className="size-4" />
              </div>
              <div>
                <div className="font-medium">{x.t}</div>
                <div className="text-muted-foreground">{x.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoForm() {
  const [form, setForm] = useState({ schoolName: "", name: "", email: "", phone: "", students: "", challenge: "", current: "", date: "", time: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const onChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setErrors({});
    const list = JSON.parse(localStorage.getItem("scholarii-demo-requests") || "[]");
    list.push({ ...form, submittedAt: new Date().toISOString() });
    localStorage.setItem("scholarii-demo-requests", JSON.stringify(list));
    setSubmitted(true);
    toast.success("Demo request submitted! We'll get in touch within 24 hours.");
  };

  if (submitted) {
    return (
      <section id="demo" className="py-20 lg:py-28">
        <div className="max-w-xl mx-auto px-5 text-center">
          <div className="size-16 rounded-full bg-brand-gradient grid place-items-center text-white mx-auto mb-6 shadow-glow">
            <Check className="size-8" />
          </div>
          <h2 className="text-3xl font-bold">You're all set!</h2>
          <p className="text-muted-foreground mt-3">Thanks {form.name}. Our team will reach out to {form.email} within 24 hours to schedule your demo.</p>
          <Link to="/login" className="mt-8 inline-block"><Button size="lg" className="bg-brand-gradient text-white border-0">Try the demo now <ArrowRight className="size-4 ml-1" /></Button></Link>
        </div>
      </section>
    );
  }

  return (
    <section id="demo" className="py-20 lg:py-28 bg-muted/30 border-y border-border/60">
      <div className="max-w-3xl mx-auto px-5">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Book your free demo</h2>
          <p className="text-muted-foreground mt-3">See how Scholarii fits your school — 30 minutes, no commitment.</p>
        </div>
        <Card className="p-6 md:p-8 shadow-glow border-border/60">
          <form className="grid md:grid-cols-2 gap-5" onSubmit={submit} noValidate>
            <Field label="School name *" error={errors.schoolName}>
              <Input value={form.schoolName} onChange={(e) => onChange("schoolName", e.target.value)} placeholder="Springfield Public School" />
            </Field>
            <Field label="Your name *" error={errors.name}>
              <Input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Principal / Owner name" />
            </Field>
            <Field label="Email *" error={errors.email}>
              <Input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="you@school.com" />
            </Field>
            <Field label="Phone *" error={errors.phone}>
              <Input value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="+91 98765 43210" />
            </Field>
            <Field label="Number of students *" error={errors.students}>
              <Select value={form.students} onValueChange={(v) => onChange("students", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="<100">Less than 100</SelectItem>
                  <SelectItem value="100-500">100 – 500</SelectItem>
                  <SelectItem value="500-1000">500 – 1,000</SelectItem>
                  <SelectItem value="1000+">1,000+</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Biggest challenge *" error={errors.challenge}>
              <Select value={form.challenge} onValueChange={(v) => onChange("challenge", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fee Collection">Fee Collection</SelectItem>
                  <SelectItem value="Attendance">Attendance</SelectItem>
                  <SelectItem value="Communication">Communication</SelectItem>
                  <SelectItem value="All">All of the above</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Current system *" error={errors.current}>
              <Select value={form.current} onValueChange={(v) => onChange("current", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Other ERP">Other ERP</SelectItem>
                  <SelectItem value="Nothing">Nothing yet</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Preferred date">
              <Input type="date" value={form.date} onChange={(e) => onChange("date", e.target.value)} />
            </Field>
            <Field label="Preferred time">
              <Input type="time" value={form.time} onChange={(e) => onChange("time", e.target.value)} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Message">
                <Textarea rows={3} value={form.message} onChange={(e) => onChange("message", e.target.value)} placeholder="Anything specific you'd like to discuss?" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" size="lg" className="w-full bg-brand-gradient text-white border-0 hover:opacity-90 shadow-glow">Book My Demo</Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-10 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-5 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-brand-gradient grid place-items-center text-white text-xs font-bold">S</div>
          <span>© {new Date().getFullYear()} Scholarii. Made with care in India.</span>
        </div>
        <div className="flex gap-6">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#demo" className="hover:text-foreground">Demo</a>
          <Link to="/login" className="hover:text-foreground">Login</Link>
        </div>
      </div>
    </footer>
  );
}
