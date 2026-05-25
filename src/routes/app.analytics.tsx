import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/analytics")({
  component: () => <ComingSoon title="Analytics" subtitle="School-wide trends and reports." />,
});
