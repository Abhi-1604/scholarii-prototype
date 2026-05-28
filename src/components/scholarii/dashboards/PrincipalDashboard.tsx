import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/scholarii/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Zap } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";

import { loadData } from "@/lib/scholarii/mock";
import { 
  calculateStudentAttendanceKPI,
  calculateTeacherAttendanceKPI,
  calculateFeeCollectionKPI,
  calculateAcademicPerformanceKPI,
  calculateParentEngagementKPI,
  calculateTeacherWorkloadKPI,
  calculateSchoolPulse,
  generateOperationalSummary,
  generateLiveActivityEvent,
} from "@/lib/scholarii/kpi-calculations";

// NEW: Intelligence engine
import {
  generateAttendanceAlerts,
  generateFeeAlerts,
  generateAcademicAlerts,
  generateEngagementAlerts,
  generateWorkloadAlerts,
  generateRecommendations,
  calculateRiskMetrics,
} from "@/lib/scholarii/intelligence-engine";

import { KPICarousel } from "@/components/scholarii/KPICarousel";
import { SchoolPulse } from "@/components/scholarii/SchoolPulse";
import { LiveActivityFeed } from "@/components/scholarii/LiveActivityFeed";
import { AIInsightsPanel } from "@/components/scholarii/AIInsightsPanel"; // NEW
import { AttendancePieChart } from "@/components/scholarii/AttendancePieChart";

// Import all modal components
import { AttendanceDetailModal } from "@/components/scholarii/modals/AttendanceDetailModal";
import { TeacherAttendanceModal } from "@/components/scholarii/modals/TeacherAttendanceModal";
import { FeeCollectionDetailModal } from "@/components/scholarii/modals/FeeCollectionDetailModal";
import { AcademicPerformanceModal } from "@/components/scholarii/modals/AcademicPerformanceModal";
import { ParentEngagementModal } from "@/components/scholarii/modals/ParentEngagementModal";
import { TeacherWorkloadModal } from "@/components/scholarii/modals/TeacherWorkloadModal";

import type { KPICard, ActivityEvent, Alert, Recommendation } from "@/lib/scholarii/types";
import { monthlyAttendance, feeCollection, attendanceDistribution } from "@/lib/scholarii/mock";

export function PrincipalDashboard() {
  const data = useMemo(() => loadData(), []);
  
  // Calculate all KPIs
  const attendanceKPI = useMemo(() => calculateStudentAttendanceKPI(data.students), [data.students]);
  const teacherAttendanceKPI = useMemo(() => calculateTeacherAttendanceKPI(data.teachers), [data.teachers]);
  const feeCollectionKPI = useMemo(() => calculateFeeCollectionKPI(data.students, data.feeTarget), [data.students, data.feeTarget]);
  const academicPerformanceKPI = useMemo(() => calculateAcademicPerformanceKPI(data.students), [data.students]);
  const parentEngagementKPI = useMemo(() => calculateParentEngagementKPI(data.students), [data.students]);
  const teacherWorkloadKPI = useMemo(() => calculateTeacherWorkloadKPI(data.teachers), [data.teachers]);
  const classPerformanceByGrade = useMemo(() => {
    const gradeMap = new Map<number, { total: number; count: number }>();

    data.students.forEach((student) => {
      if (!student.testScores) return;

      const scores = Object.values(student.testScores);
      if (scores.length === 0) return;

      const studentAverage = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const current = gradeMap.get(student.grade) || { total: 0, count: 0 };
      gradeMap.set(student.grade, {
        total: current.total + studentAverage,
        count: current.count + 1,
      });
    });

    return Array.from({ length: 10 }, (_, index) => {
      const grade = index + 1;
      const bucket = gradeMap.get(grade);

      return {
        c: String(grade),
        v: bucket && bucket.count > 0 ? Math.round(bucket.total / bucket.count) : 0,
        students: bucket?.count || 0,
      };
    });
  }, [data.students]);

  const kpis: KPICard[] = [
    attendanceKPI,
    teacherAttendanceKPI,
    feeCollectionKPI,
    academicPerformanceKPI,
    parentEngagementKPI,
    teacherWorkloadKPI,
  ];

  // School Pulse & Summary
  const schoolPulseSectors = useMemo(() => calculateSchoolPulse(data.students, data.teachers, data.feeTarget), [data.students, data.teachers, data.feeTarget]);
  const operationalSummary = useMemo(() => generateOperationalSummary(data.students, data.teachers, data.feeTarget), [data.students, data.teachers, data.feeTarget]);

  // NEW: Intelligence Layer Calculations
  const alerts = useMemo(() => {
    const all: Alert[] = [];
    all.push(...generateAttendanceAlerts(data.students));
    all.push(...generateFeeAlerts(data.students, data.feeTarget));
    all.push(...generateAcademicAlerts(data.students));
    all.push(...generateEngagementAlerts(data.students));
    all.push(...generateWorkloadAlerts(data.teachers));

    // Sort: critical > warning > info
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return all
      .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
      .slice(0, 8); // Limit to 8 total
  }, [data.students, data.teachers, data.feeTarget]);

  const recommendations = useMemo(() => {
    return generateRecommendations(
      data.students,
      data.teachers,
      data.feeTarget,
      alerts
    ).slice(0, 3); // Top 3
  }, [data.students, data.teachers, data.feeTarget, alerts]);

  const riskMetrics = useMemo(() => {
    return calculateRiskMetrics(data.students, data.teachers);
  }, [data.students, data.teachers]);

  // Activity feed state with real-time simulation
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(data.activityEvents);

  // Simulate real-time activity events
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = generateLiveActivityEvent();
      setActivityEvents((prev) => [newEvent, ...prev.slice(0, 5)]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Modal state management
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);

  const handleKPIClick = (kpiId: string) => {
    setSelectedKPI(kpiId);
  };

  // NEW: Alert and recommendation handlers
  const handleAlertClick = (alert: Alert) => {
    // Map alert context to KPI modal
    if (alert.context.type === "attendance") {
      setSelectedKPI("attendance-kpi");
    } else if (alert.context.type === "fees") {
      setSelectedKPI("fee-collection-kpi");
    } else if (alert.context.type === "academics") {
      setSelectedKPI("academic-performance-kpi");
    } else if (alert.context.type === "engagement") {
      setSelectedKPI("parent-engagement-kpi");
    } else if (alert.context.type === "workload") {
      setSelectedKPI("teacher-workload-kpi");
    }
  };

  const handleRecommendationClick = (recommendation: Recommendation) => {
    // Map recommendation target to KPI modal
    if (recommendation.actionTarget) {
      setSelectedKPI(recommendation.actionTarget);
    }
  };

  const modalProps = {
    students: data.students,
    teachers: data.teachers,
    feeTarget: data.feeTarget,
  };

  return (
    <div>
      <PageHeader
        title="Welcome back, Dr. Asha"
        subtitle="Real-time school operations command center"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="size-4 mr-1" />
              Report
            </Button>
            <Button size="sm" className="bg-brand-gradient text-white border-0">
              <Plus className="size-4 mr-1" />
              Quick Action
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* KPI Carousel Section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Key Performance Indicators</h2>
              <Badge variant="secondary">Click to drill down</Badge>
            </div>
            <KPICarousel kpis={kpis} onKPIClick={handleKPIClick} />
          </div>

          {/* School Pulse Section */}
          <div>
            <SchoolPulse sectors={schoolPulseSectors} summary={operationalSummary} />
          </div>

          {/* Attendance Overview Section: Pie Chart (Left) + Summary Cards (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Attendance Pie Chart */}
            <div className="lg:col-span-1">
              <AttendancePieChart data={attendanceDistribution} title="Today's Attendance" />
            </div>

            {/* Right: Summary Stats Cards */}
            <div className="lg:col-span-2 space-y-4">
              {/* Top Performing Classes */}
              <Card className="p-5">
                <h3 className="font-semibold text-sm mb-4">Top Performing Grades</h3>
                <div className="space-y-3">
                  {classPerformanceByGrade.slice().sort((a, b) => b.v - a.v).slice(0, 4).map((cls, i) => (
                    <div key={i} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center text-white text-xs font-semibold">
                          {cls.c}
                        </div>
                        <span className="font-medium text-sm">Grade {cls.c}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">{cls.v}%</div>
                        <div className="text-xs text-muted-foreground">Performance</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Fee Collection Summary */}
              <Card className="p-5">
                <h3 className="font-semibold text-sm mb-4">Fee Collection Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Paid</div>
                    <div className="text-lg font-bold text-emerald-600">{data.students.filter(s => s.feeStatus === "Paid").length}</div>
                    <div className="text-xs text-emerald-600/80">students</div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Pending</div>
                    <div className="text-lg font-bold text-amber-600">{data.students.filter(s => s.feeStatus === "Pending").length}</div>
                    <div className="text-xs text-amber-600/80">students</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-red-50 dark:bg-red-950 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Overdue</div>
                    <div className="text-lg font-bold text-red-600">{data.students.filter(s => s.feeStatus === "Overdue").length}</div>
                    <div className="text-xs text-red-600/80">students</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Collection %</div>
                    <div className="text-lg font-bold text-blue-600">{feeCollectionKPI.percentage}%</div>
                    <div className="text-xs text-blue-600/80">of target</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content Grid: Activity Feed + Analytics + AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column: Live Activity Feed */}
            <div className="lg:col-span-1">
              <LiveActivityFeed events={activityEvents} />
            </div>

            {/* Middle Column: Analytics Charts */}
            <div className="lg:col-span-1 space-y-4">
              {/* Attendance Analytics Mini */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-sm">Student Attendance Trend</h3>
                    <p className="text-xs text-muted-foreground">Monthly average attendance across all students</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Last 8mo</Badge>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={monthlyAttendance}>
                    <defs>
                      <linearGradient id="attTrendMini" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="var(--brand-from)" />
                        <stop offset="100%" stopColor="var(--brand-to)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis domain={[80, 100]} stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip
                      contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
                      formatter={(value: number) => [`${value}% average`, "Attendance"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Line type="monotone" dataKey="v" stroke="url(#attTrendMini)" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Class Performance Mini */}
              <Card className="p-5">
                <div className="mb-4">
                  <h3 className="font-semibold text-sm">Class Performance by Grade</h3>
                  <p className="text-xs text-muted-foreground">Average test score across all subjects for each grade</p>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={classPerformanceByGrade}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="c" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis domain={[60, 100]} stroke="var(--muted-foreground)" fontSize={11} />
                    <Tooltip
                      contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }}
                      formatter={(value: number) => [`${value}% average`, "Class average"]}
                      labelFormatter={(label) => `Grade ${label}`}
                    />
                    <Bar dataKey="v" fill="var(--brand-to)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Fee Collection Mini */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Fee Trends</h3>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={feeCollection}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => `${v / 1000}K`} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
                    <Bar dataKey="v" fill="var(--brand-from)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

            </div>

            {/* Right Column: AI Insights */}
            <div className="lg:col-span-1">
              <Card className="p-5 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="size-5 text-amber-500" />
                  <h3 className="font-semibold">AI Insights</h3>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                  <AIInsightsPanel
                    alerts={alerts}
                    recommendations={recommendations}
                    riskMetrics={riskMetrics}
                    onAlertClick={handleAlertClick}
                    onActionClick={handleRecommendationClick}
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* System Status Footer */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold mb-4">System Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Students</div>
                  <div className="text-2xl font-bold mt-1">{data.students.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Teachers</div>
                  <div className="text-2xl font-bold mt-1">{data.teachers.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Admission Pipeline</div>
                  <div className="text-2xl font-bold mt-1">{data.admissionFunnel.admitted}</div>
                  <div className="text-xs text-muted-foreground">Admitted this term</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Fee Target</div>
                  <div className="text-2xl font-bold mt-1">₹{(data.feeTarget / 100000).toFixed(1)}L</div>
                  <div className="text-xs text-muted-foreground">Monthly target</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

      {/* Modal Components */}
      <AttendanceDetailModal open={selectedKPI === "attendance-kpi"} onOpenChange={(open) => !open && setSelectedKPI(null)} {...modalProps} />
      <TeacherAttendanceModal open={selectedKPI === "teacher-attendance-kpi"} onOpenChange={(open) => !open && setSelectedKPI(null)} {...modalProps} />
      <FeeCollectionDetailModal open={selectedKPI === "fee-collection-kpi"} onOpenChange={(open) => !open && setSelectedKPI(null)} {...modalProps} />
      <AcademicPerformanceModal open={selectedKPI === "academic-performance-kpi"} onOpenChange={(open) => !open && setSelectedKPI(null)} {...modalProps} />
      <ParentEngagementModal open={selectedKPI === "parent-engagement-kpi"} onOpenChange={(open) => !open && setSelectedKPI(null)} {...modalProps} />
      <TeacherWorkloadModal open={selectedKPI === "teacher-workload-kpi"} onOpenChange={(open) => !open && setSelectedKPI(null)} {...modalProps} />
    </div>
  );
}
