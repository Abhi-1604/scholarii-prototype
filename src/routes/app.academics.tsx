import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, TrendingUp, Award, Target } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { classPerformance } from "@/lib/scholarii/mock";

export const Route = createFileRoute("/app/academics")({ component: AcademicsPage });

const subjects = [
  { name: "Mathematics", avg: 82, trend: +3, top: "Ananya S." },
  { name: "English", avg: 78, trend: +1, top: "Vivaan P." },
  { name: "Science", avg: 85, trend: +5, top: "Diya K." },
  { name: "Social Studies", avg: 74, trend: -2, top: "Aarav M." },
  { name: "Hindi", avg: 80, trend: +2, top: "Saanvi R." },
  { name: "Computer Science", avg: 88, trend: +6, top: "Ishaan G." },
];

const trend = [
  { m: "Apr", v: 76 }, { m: "May", v: 78 }, { m: "Jun", v: 79 },
  { m: "Jul", v: 81 }, { m: "Aug", v: 80 }, { m: "Sep", v: 83 }, { m: "Oct", v: 85 },
];

function AcademicsPage() {
  return (
    <div>
      <PageHeader title="Academic Overview" subtitle="School-wide performance, exams and subject insights." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Overall Avg", value: "82.4%", icon: Target, color: "from-violet-500 to-fuchsia-500" },
          { label: "Pass Rate", value: "96.2%", icon: Award, color: "from-emerald-500 to-teal-500" },
          { label: "Top Class", value: "10-A", icon: TrendingUp, color: "from-amber-500 to-orange-500" },
          { label: "Subjects", value: "10", icon: BookOpen, color: "from-sky-500 to-indigo-500" },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className={`size-10 rounded-xl bg-gradient-to-br ${s.color} grid place-items-center text-white mb-3`}><s.icon className="size-5" /></div>
            <div className="text-2xl font-semibold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="subjects">
        <TabsList><TabsTrigger value="subjects">Subjects</TabsTrigger><TabsTrigger value="classes">Classes</TabsTrigger><TabsTrigger value="trend">Trend</TabsTrigger></TabsList>

        <TabsContent value="subjects" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            {subjects.map((s) => (
              <Card key={s.name} className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">Top scorer · {s.top}</div>
                  </div>
                  <Badge variant={s.trend >= 0 ? "secondary" : "destructive"} className={s.trend >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : ""}>{s.trend >= 0 ? "+" : ""}{s.trend}%</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mb-1.5"><span className="text-muted-foreground">Class average</span><span className="font-medium">{s.avg}%</span></div>
                <Progress value={s.avg} />
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="classes" className="mt-4">
          <Card className="p-5">
            <div className="font-semibold mb-4">Average score by grade</div>
            <div className="h-72">
              <ResponsiveContainer><BarChart data={classPerformance}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="c" /><YAxis /><Tooltip /><Bar dataKey="v" fill="url(#g1)" radius={[8, 8, 0, 0]} /><defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#667eea" /><stop offset="100%" stopColor="#764ba2" /></linearGradient></defs></BarChart></ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="trend" className="mt-4">
          <Card className="p-5">
            <div className="font-semibold mb-4">Monthly performance trend</div>
            <div className="h-72">
              <ResponsiveContainer><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="m" /><YAxis /><Tooltip /><Line type="monotone" dataKey="v" stroke="#667eea" strokeWidth={3} dot={{ r: 5 }} /></LineChart></ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
