import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DollarSign, TrendingUp, AlertCircle, Wallet, Send, CreditCard } from "lucide-react";
import { useAuth } from "@/lib/scholarii/auth";
import { loadData, feeCollection } from "@/lib/scholarii/mock";
import { useMemo } from "react";
import { toast } from "sonner";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/app/fees")({ component: FeesPage });

function FeesPage() {
  const { user } = useAuth();
  if (user?.role === "student") return <StudentFeesView />;
  return <AdminFeesView />;
}

function StudentFeesView() {
  return (
    <div>
      <PageHeader title="Fees" subtitle="View and pay your school fees." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">This Year's Fee</h3>
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-sm text-muted-foreground">Paid so far</div>
              <div className="text-3xl font-bold mt-1">₹85,000 <span className="text-base text-muted-foreground font-normal">/ ₹1,20,000</span></div>
            </div>
            <Badge className="bg-brand-gradient border-0">71% complete</Badge>
          </div>
          <Progress value={71} className="h-2 mt-3" />
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            {[
              { l: "Tuition", v: "₹80,000" }, { l: "Library", v: "₹5,000" },
              { l: "Sports", v: "₹10,000" }, { l: "Lab", v: "₹25,000" },
            ].map((b) => (
              <div key={b.l} className="p-3 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground">{b.l}</div>
                <div className="font-semibold mt-1">{b.v}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-accent/40 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-sm text-muted-foreground">Next installment</div>
              <div className="font-semibold mt-0.5">₹35,000 due Jan 10, 2026</div>
            </div>
            <Button className="bg-brand-gradient text-white border-0" onClick={() => toast.success("Payment gateway opening (demo)")}><CreditCard className="size-4 mr-1" />Pay Now</Button>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Payment History</h3>
          <div className="space-y-3 text-sm">
            {[
              { d: "Oct 5", a: "₹35,000", m: "UPI", r: "RCP-1023" },
              { d: "Jul 8", a: "₹30,000", m: "Card", r: "RCP-0941" },
              { d: "Apr 12", a: "₹20,000", m: "UPI", r: "RCP-0832" },
            ].map((p) => (
              <div key={p.r} className="flex justify-between items-center p-2 rounded-lg hover:bg-accent/40 transition-colors">
                <div>
                  <div className="font-medium">{p.a}</div>
                  <div className="text-xs text-muted-foreground">{p.d} • {p.m}</div>
                </div>
                <Button variant="ghost" size="sm">{p.r}</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdminFeesView() {
  const data = useMemo(() => loadData(), []);
  const defaulters = data.students.filter(s => s.feeStatus !== "Paid").slice(0, 8);
  return (
    <div>
      <PageHeader title="Fee Reports" subtitle="Collection insights and defaulters." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Today" value="₹86K" tone="success" />
        <StatCard icon={TrendingUp} label="This Week" value="₹4.2L" />
        <StatCard icon={Wallet} label="This Month" value="₹6.85L" tone="info" />
        <StatCard icon={AlertCircle} label="Outstanding" value="₹2.3L" tone="warning" />
      </div>

      <Card className="p-5 mt-6">
        <h3 className="font-semibold mb-4">Collection Trend</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={feeCollection}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
            <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v: number) => `₹${v.toLocaleString()}`} />
            <Bar dataKey="v" fill="var(--brand-from)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="mt-6">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold">Fee Defaulters</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Pending</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {defaulters.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8"><AvatarFallback style={{ backgroundColor: s.avatarColor, color: "white" }}>{s.name.split(" ").map(p => p[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </TableCell>
                <TableCell>{s.grade}-{s.section}</TableCell>
                <TableCell className="font-semibold">₹{(Math.random() * 30000 + 10000).toFixed(0)}</TableCell>
                <TableCell><Badge variant={s.feeStatus === "Overdue" ? "destructive" : "outline"}>{s.feeStatus}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Reminder sent to ${s.parent}`)}><Send className="size-3.5 mr-1" />Send Reminder</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
