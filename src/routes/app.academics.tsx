import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/academics")({
  component: () => <ComingSoon title="Academic Overview" subtitle="Performance and exam insights." />,
});
