import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/events")({
  component: () => <ComingSoon title="Events" subtitle="School calendar and upcoming events." />,
});
