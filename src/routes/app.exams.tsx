import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/exams")({
  component: () => <ComingSoon title="Exams & Results" subtitle="Upcoming exams and past results." />,
});
