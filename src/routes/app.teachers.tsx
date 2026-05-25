import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Star, Mail, Phone } from "lucide-react";
import { loadData } from "@/lib/scholarii/mock";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/app/teachers")({ component: TeachersPage });

function TeachersPage() {
  const data = useMemo(() => loadData(), []);
  const [q, setQ] = useState("");
  const filtered = data.teachers.filter(t => !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.subject.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Teachers"
        subtitle={`${data.teachers.length} teachers on staff.`}
        action={<Button size="sm" className="bg-brand-gradient text-white border-0"><Plus className="size-4 mr-1" />Add Teacher</Button>}
      />
      <Card className="p-4 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name or subject..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <Card key={t.id} className="p-5 hover:shadow-glow transition-shadow">
            <div className="flex items-center gap-3">
              <Avatar className="size-12"><AvatarFallback style={{ backgroundColor: t.avatarColor, color: "white" }}>{t.name.split(" ").map(p => p[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.subject}</div>
              </div>
              <Badge variant={t.status === "Active" ? "secondary" : "outline"} className={t.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : ""}>{t.status}</Badge>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="size-3.5" /><span className="truncate">{t.email}</span></div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="size-3.5" />{t.phone}</div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {t.classes.map((c) => <Badge key={c} variant="outline" className="text-[10px]">Class {c}</Badge>)}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-3.5 ${i < Math.round(t.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{t.rating.toFixed(1)}</span>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
