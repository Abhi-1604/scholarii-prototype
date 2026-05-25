import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/logs")({
  component: () => <ComingSoon title="Audit Logs" subtitle="Track every action on the system." />,
});
