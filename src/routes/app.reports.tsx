import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/reports")({
  component: () => <ComingSoon title="Reports & Export" subtitle="Generate and export reports." />,
});
