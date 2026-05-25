import { PageHeader, StatCard } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, ClipboardCheck, DollarSign, Plus, Megaphone, FileText, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { loadData, monthlyAttendance, feeCollection, classPerformance } from "@/lib/scholarii/mock";
import { useMemo } from "react";

export function PrincipalDashboard() {
  const data = useMemo(() => loadData(), []);
  const totalStudents = data.students.length;
  const totalTeachers = data.teachers.length;
  const avgAttendance = Math.round(data.students.reduce((s, x) => s + x.attendance, 0) / data.students.length);
  const feeThisMonth = feeCollection[feeCollection.length - 1].v;

  return (
    <div>
      <PageHeader
        title="Welcome back, Dr. Asha"
        subtitle="Here's what's happening at your school today."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><FileText className="size-4 mr-1" />Report</Button>
            <Button size="sm" className="bg-brand-gradient text-white border-0"><Plus className="size-4 mr-1" />Add Student</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={totalStudents.toString()} hint="+12 this month" />
        <StatCard icon={Briefcase} label="Total Teachers" value={totalTeachers.toString()} hint="3 on leave today" tone="info" />
        <StatCard icon={ClipboardCheck} label="Attendance Today" value={`${avgAttendance}%`} hint="Above target" tone="success" />
        <StatCard icon={DollarSign} label="Fees This Month" value={`₹${(feeThisMonth / 1000).toFixed(0)}K`} hint="92% of target" tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Monthly Attendance Trend</h3>
            <Badge variant="secondary">Last 8 months</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyAttendance}>
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--brand-from)" />
                  <stop offset="100%" stopColor="var(--brand-to)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis domain={[80, 100]} stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="v" stroke="url(#lg1)" strokeWidth={3} dot={{ fill: "var(--brand-from)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: Plus, label: "Add New Student" },
              { icon: Megaphone, label: "Create Announcement" },
              { icon: FileText, label: "Generate Report" },
              { icon: Calendar, label: "Schedule PTA Meeting" },
            ].map((a) => (
              <button key={a.label} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors text-sm">
                <div className="size-9 rounded-lg bg-brand-gradient grid place-items-center text-white">
                  <a.icon className="size-4" />
                </div>
                <span className="font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Fee Collection Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={feeCollection}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="v" fill="var(--brand-from)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Class-wise Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={classPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="c" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis domain={[60, 100]} stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="v" fill="var(--brand-to)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-5 mt-6">
        <h3 className="font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {[
            { t: "New admission", d: "Aarush Joshi enrolled in Class 6-A", time: "2 hours ago", tone: "bg-emerald-500" },
            { t: "Fee payment", d: "₹45,000 received from Class 10-B", time: "4 hours ago", tone: "bg-violet-500" },
            { t: "Leave request", d: "Mr. Verma requested leave for Dec 15", time: "Yesterday", tone: "bg-amber-500" },
            { t: "Announcement sent", d: "Sports Day notice — 450 recipients", time: "Yesterday", tone: "bg-sky-500" },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 py-2">
              <div className={`size-2 rounded-full mt-2 ${a.tone}`} />
              <div className="flex-1">
                <div className="text-sm font-medium">{a.t}</div>
                <div className="text-sm text-muted-foreground">{a.d}</div>
              </div>
              <div className="text-xs text-muted-foreground">{a.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
