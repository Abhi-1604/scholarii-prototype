import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, UserPlus, IndianRupee, AlertCircle, FileText, DoorOpen,
  ClipboardList, UserCog, TrendingUp, TrendingDown, Zap, ArrowRight, CheckCircle2, Clock, AlertTriangle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { loadData } from "@/lib/scholarii/mock";
import { toast } from "sonner";

// Simple sparkline data generator
const generateSparklineData = () => Array.from({ length: 7 }, (_, i) => ({ v: Math.floor(Math.random() * 30 + 50) }));

export function AdminDashboard() {
  const data = useMemo(() => loadData(), []);
  const [feeTab, setFeeTab] = useState<"Today" | "This week" | "This month">("This month");

  // KPI Cards data
  const kpiCards = [
    {
      label: "Total Students",
      value: "430",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      sub: "Active enrollment",
      dot: "bg-green-500",
      delta: "↑ 2 this month",
      deltaColor: "text-green-600",
    },
    {
      label: "Today's Admissions",
      value: "3 New",
      icon: UserPlus,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      sub: "Registration",
      dot: "bg-blue-500",
      delta: "+1 vs yesterday",
      deltaColor: "text-blue-600",
    },
    {
      label: "Fee Collected Today",
      value: "₹24,500",
      icon: IndianRupee,
      color: "text-green-600",
      bgColor: "bg-green-50",
      sub: "Day's collection",
      dot: "bg-green-500",
      delta: "↑ 12% vs yesterday",
      deltaColor: "text-green-600",
    },
    {
      label: "Pending Fee Amount",
      value: "₹1,82,000",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      sub: "Overdue accounts",
      dot: "bg-amber-500",
      delta: "38 students overdue",
      deltaColor: "text-amber-600",
    },
    {
      label: "Certificates Pending",
      value: "7",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      sub: "Pending issuance",
      dot: "bg-amber-500",
      delta: "TC: 3 | Bonafide: 4",
      deltaColor: "text-orange-600",
    },
    {
      label: "Visitors Today",
      value: "12",
      icon: Users,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      sub: "Entry records",
      dot: "bg-gray-500",
      delta: "3 currently inside",
      deltaColor: "text-gray-600",
    },
  ];

  // Quick Actions data
  const quickActions = [
    { icon: UserPlus, color: "text-violet-600", bgColor: "bg-violet-50", title: "New Admission", desc: "Register a new student" },
    { icon: IndianRupee, color: "text-green-600", bgColor: "bg-green-50", title: "Collect Fee", desc: "Record payment and issue receipt" },
    { icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50", title: "Issue Certificate", desc: "TC, Bonafide, or Character cert" },
    { icon: ClipboardList, color: "text-orange-600", bgColor: "bg-orange-50", title: "Mark Attendance", desc: "Update today's records" },
    { icon: UserCog, color: "text-slate-600", bgColor: "bg-slate-50", title: "Add Staff Record", desc: "Update employee information" },
    { icon: DoorOpen, color: "text-red-600", bgColor: "bg-red-50", title: "Log Visitor", desc: "Record entry for today" },
  ];

  // Recent Activities data
  const activities = [
    { initials: "PA", title: "Issued Bonafide Certificate", desc: "Rohan Verma — Grade 4B", time: "10 mins ago" },
    { initials: "PA", title: "Fee Collected", desc: "₹4,500 from Aarav Sharma (Grade 1A)", time: "25 mins ago" },
    { initials: "PA", title: "New Admission Registered", desc: "Ananya Kapoor — Grade 3", time: "1 hr ago" },
    { initials: "PA", title: "Address Updated", desc: "Ishaan Singh — Grade 2A", time: "2 hrs ago" },
    { initials: "PA", title: "TC Issued", desc: "Meera Pillai — Grade 5C", time: "3 hrs ago" },
    { initials: "PA", title: "Visitor Logged", desc: "Mr. Suresh Nair — Parent inquiry", time: "3.5 hrs ago" },
    { initials: "PA", title: "Bulk Attendance Marked", desc: "430 students — today", time: "4 hrs ago" },
    { initials: "PA", title: "Fee Report Generated", desc: "May 2026 collection summary", time: "Yesterday" },
    { initials: "PA", title: "Staff Record Added", desc: "Mrs. Kavita Soni — Peon", time: "Yesterday" },
    { initials: "PA", title: "Circular Sent", desc: "Summer Holiday Notice — All parents", time: "2 days ago" },
  ];

  // Upcoming Tasks data
  const [tasksCompleted, setTasksCompleted] = useState<boolean[]>([false, false, false, false, false, false]);
  const tasks = [
    { title: "Process 3 pending TC requests", dueType: "Today", priority: "red" },
    { title: "Follow up on ₹82,000 overdue fees (12 students)", dueType: "Today", priority: "red" },
    { title: "Complete Ananya Kapoor admission paperwork", dueType: "Today", priority: "amber" },
    { title: "Print report cards for Grade 5", dueType: "Tomorrow", priority: "amber" },
    { title: "Update government compliance attendance report", dueType: "This week", priority: "gray" },
    { title: "Inventory check: stationery and lab supplies", dueType: "This week", priority: "gray" },
  ];

  // Fee Collection data
  const feeGradeData = [
    { grade: "Grade 1", collected: 42000, target: 48000 },
    { grade: "Grade 2", collected: 38500, target: 46000 },
    { grade: "Grade 3", collected: 29000, target: 42000 },
    { grade: "Grade 4", collected: 21000, target: 38000 },
    { grade: "Grade 5", collected: 18000, target: 36000 },
  ];

  const overdueAlerts = [
    { initials: "AS", name: "Aarav Sharma", class: "1A", amount: "₹12,000", days: "45 days" },
    { initials: "RP", name: "Rohan Patel", class: "3B", amount: "₹8,500", days: "32 days" },
    { initials: "KJ", name: "Kavya Joshi", class: "4C", amount: "₹14,000", days: "28 days" },
    { initials: "MP", name: "Meera Pillai", class: "2A", amount: "₹6,000", days: "15 days" },
    { initials: "SK", name: "Sanvi Kapoor", class: "5B", amount: "₹9,500", days: "12 days" },
  ];

  // Today's Admissions data
  const admissions = [
    { name: "Ananya Kapoor", grade: "Grade 3", parent: "Sunita Kapoor", status: "In Progress", color: "bg-blue-100 text-blue-700" },
    { name: "Dev Sharma", grade: "Grade 1", parent: "Ramesh Sharma", status: "Approved", color: "bg-green-100 text-green-700" },
    { name: "Tina Mehta", grade: "Grade 5", parent: "Priya Mehta", status: "Pending Docs", color: "bg-amber-100 text-amber-700" },
  ];

  // Visitor Log data
  const visitors = [
    { name: "Suresh Nair", purpose: "Parent Inquiry", timeIn: "9:15 AM", status: "Checked Out" },
    { name: "Meena Gupta", purpose: "Fee Payment", timeIn: "10:00 AM", status: "Checked Out" },
    { name: "Amit Verma", purpose: "TC Collection", timeIn: "11:30 AM", status: "Checked Out" },
    { name: "Priya Soni", purpose: "Meeting — Principal", timeIn: "1:00 PM", status: "Inside" },
    { name: "Unknown Vendor", purpose: "Stationery Delivery", timeIn: "2:30 PM", status: "Inside" },
  ];

  const handleRemindClick = () => {
    toast.success("Reminder sent to parent");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Today's Office Overview</h1>
          <p className="text-sm text-gray-500 mt-1">All administrative tasks and records at a glance</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg">
            <span>+ Quick Action</span>
          </Button>
          <Button variant="outline" className="rounded-lg border-gray-200">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Section 1: KPI Stat Cards */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-min">
          {kpiCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="flex-shrink-0 w-72 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="text-xs text-gray-500 font-medium">{card.label}</div>
                  <div className={`${card.bgColor} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-3xl font-bold text-gray-900">{card.value}</div>
                  <div className="text-xs text-gray-500">{card.sub}</div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className={`w-2 h-2 rounded-full ${card.dot}`} />
                  <div className={`text-xs font-medium ${card.deltaColor}`}>{card.delta}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Quick Actions Grid */}
      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-500">Frequently used tasks</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm p-5 hover:border-violet-600 hover:border-2 hover:p-4.5 transition-all cursor-pointer"
              >
                <div className={`${action.bgColor} p-3 rounded-lg w-fit mb-3`}>
                  <Icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{action.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Two Column Layout - Recent Activities & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Activities - 60% */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <p className="text-sm text-gray-500">Last actions performed</p>
          </div>
          <div className="space-y-0 max-h-96 overflow-y-auto">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 px-2 -mx-2 rounded">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-white">{activity.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900">{activity.title}</div>
                  <div className="text-xs text-gray-500 truncate">{activity.desc}</div>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap ml-2">{activity.time}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <a href="#" className="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center justify-end gap-1">
              View all activity <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Upcoming Tasks - 40% */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
            <p className="text-sm text-gray-500">Pending for today and this week</p>
          </div>
          <div className="space-y-2">
            {tasks.map((task, idx) => {
              const priorityDot = task.priority === "red" ? "bg-red-500" : task.priority === "amber" ? "bg-amber-500" : "bg-gray-400";
              const dueBadgeColor = task.dueType === "Today" ? "bg-red-100 text-red-700" : task.dueType === "Tomorrow" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700";

              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    const newCompleted = [...tasksCompleted];
                    newCompleted[idx] = !newCompleted[idx];
                    setTasksCompleted(newCompleted);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={tasksCompleted[idx]}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                  <div className={`w-2 h-2 rounded-full ${priorityDot} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium text-gray-700 ${tasksCompleted[idx] ? "line-through text-gray-400" : ""}`}>
                      {task.title}
                    </p>
                  </div>
                  <Badge className={`text-xs flex-shrink-0 ${dueBadgeColor} border-0`}>
                    {task.dueType}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 4: Fee Collection Summary */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Fee Collection Summary</h2>
            <p className="text-sm text-gray-500">June 2026</p>
          </div>
          <div className="flex gap-2">
            {(["Today", "This week", "This month"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFeeTab(tab)}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                  feeTab === tab
                    ? "text-violet-600 border-violet-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Collection by Grade */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Collection by Grade</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={feeGradeData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#999" fontSize={12} />
                <YAxis dataKey="grade" stroke="#999" fontSize={12} width={90} />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="collected" fill="#7C3AED" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Right: Overdue Fee Alerts */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Overdue Fee Alerts</h3>
            <p className="text-xs text-gray-500 mb-3">Students with pending fees</p>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {overdueAlerts.map((alert, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-white">{alert.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900">{alert.name}, {alert.class}</div>
                    <div className="text-xs text-gray-500">{alert.days}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <div className="text-xs font-semibold text-gray-900">{alert.amount}</div>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-violet-600 hover:text-violet-700" onClick={handleRemindClick}>
                      Remind
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-right">
              <a href="#" className="text-sm font-medium text-violet-600 hover:text-violet-700">
                View all 38 overdue →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Two Column Layout - Admissions & Visitor Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Admissions */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Admissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Student Name</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Grade</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Parent Name</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {admissions.map((adm, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{adm.name}</td>
                    <td className="px-4 py-3 text-gray-600">{adm.grade}</td>
                    <td className="px-4 py-3 text-gray-600">{adm.parent}</td>
                    <td className="px-4 py-3">
                      <Badge className={`${adm.color} border-0 text-xs`}>{adm.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-violet-600 hover:text-violet-700">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visitor Log */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Visitor Log — Today (12 visitors)</h2>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Name</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Purpose</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Time In</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((visitor, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900 font-medium">{visitor.name}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{visitor.purpose}</td>
                    <td className="px-4 py-3 text-gray-600">{visitor.timeIn}</td>
                    <td className="px-4 py-3">
                      {visitor.status === "Checked Out" ? (
                        <span className="flex items-center gap-1 text-xs text-green-700">
                          <CheckCircle2 className="w-3 h-3" /> {visitor.status}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-700">
                          <Clock className="w-3 h-3" /> {visitor.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="outline" className="w-full rounded-lg border-violet-600 text-violet-600 hover:bg-violet-50">
            <DoorOpen className="w-4 h-4 mr-2" /> + Log New Visitor
          </Button>
        </div>
      </div>
    </div>
  );
}
