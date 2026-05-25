import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/meetings")({
  component: () => <ComingSoon title="PTA Meetings" subtitle="Schedule and track parent meetings." />,
});
