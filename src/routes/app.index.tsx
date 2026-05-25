import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/scholarii/auth";
import { PrincipalDashboard } from "@/components/scholarii/dashboards/PrincipalDashboard";
import { TeacherDashboard } from "@/components/scholarii/dashboards/TeacherDashboard";
import { StudentDashboard } from "@/components/scholarii/dashboards/StudentDashboard";
import { AdminDashboard } from "@/components/scholarii/dashboards/AdminDashboard";
import { ParentDashboard } from "@/components/scholarii/dashboards/ParentDashboard";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  switch (user.role) {
    case "principal": return <PrincipalDashboard />;
    case "teacher": return <TeacherDashboard />;
    case "student": return <StudentDashboard />;
    case "admin": return <AdminDashboard />;
    case "parent": return <ParentDashboard />;
  }
}
