import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Download, Upload, Eye, Pencil, Trash2 } from "lucide-react";
import { loadData } from "@/lib/scholarii/mock";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/students")({ component: StudentsPage });

const PAGE_SIZE = 10;

function StudentsPage() {
  const data = useMemo(() => loadData(), []);
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = data.students.filter((s) => {
    if (q && !s.name.toLowerCase().includes(q.toLowerCase()) && !s.roll.toLowerCase().includes(q.toLowerCase())) return false;
    if (grade !== "all" && String(s.grade) !== grade) return false;
    if (status !== "all" && s.feeStatus !== status) return false;
    return true;
  });
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const attendanceColor = (a: number) => a >= 90 ? "text-emerald-600" : a >= 75 ? "text-amber-600" : "text-red-600";

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={`${data.students.length} students enrolled across all classes.`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Upload className="size-4 mr-1" />Import CSV</Button>
            <Button variant="outline" size="sm"><Download className="size-4 mr-1" />Export</Button>
            <AddStudentDialog />
          </div>
        }
      />

      <Card className="p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by name or roll number..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          </div>
          <Select value={grade} onValueChange={(v) => { setGrade(v); setPage(1); }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Grade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All grades</SelectItem>
              {Array.from({ length: 10 }).map((_, i) => <SelectItem key={i} value={String(i + 1)}>Grade {i + 1}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Fee status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Roll No</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Fee Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8"><AvatarFallback style={{ backgroundColor: s.avatarColor, color: "white" }}>{s.name.split(" ").map(p => p[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.parent}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{s.roll}</TableCell>
                <TableCell>Class {s.grade}-{s.section}</TableCell>
                <TableCell className={`font-medium ${attendanceColor(s.attendance)}`}>{s.attendance}%</TableCell>
                <TableCell>
                  <Badge variant={s.feeStatus === "Paid" ? "secondary" : s.feeStatus === "Overdue" ? "destructive" : "outline"}
                    className={s.feeStatus === "Paid" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300" : ""}>
                    {s.feeStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex">
                    <Button variant="ghost" size="icon" onClick={() => toast.info(`Viewing ${s.name}`)}><Eye className="size-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => toast.info("Edit form coming soon")}><Pencil className="size-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => toast.error("Delete is disabled in demo")}><Trash2 className="size-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!rows.length && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12">No students found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4 border-t border-border text-sm">
          <div className="text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <div className="px-3 py-1.5 rounded-md bg-muted">{page} / {pages}</div>
            <Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-brand-gradient text-white border-0"><Plus className="size-4 mr-1" />Add Student</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
        <form className="grid grid-cols-2 gap-3" onSubmit={(e) => { e.preventDefault(); toast.success("Student added (demo)"); setOpen(false); }}>
          <div className="space-y-1.5"><Label>Full Name</Label><Input required /></div>
          <div className="space-y-1.5"><Label>Roll Number</Label><Input required /></div>
          <div className="space-y-1.5"><Label>Class</Label><Input placeholder="e.g. 8" required /></div>
          <div className="space-y-1.5"><Label>Section</Label><Input placeholder="A" required /></div>
          <div className="space-y-1.5"><Label>Date of Birth</Label><Input type="date" /></div>
          <div className="space-y-1.5"><Label>Gender</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent><SelectItem value="M">Male</SelectItem><SelectItem value="F">Female</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 col-span-2"><Label>Parent Name</Label><Input /></div>
          <div className="space-y-1.5"><Label>Parent Phone</Label><Input /></div>
          <div className="space-y-1.5"><Label>Parent Email</Label><Input type="email" /></div>
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-brand-gradient text-white border-0">Add Student</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
