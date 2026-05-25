import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/communication")({
  component: () => <ComingSoon title="Communication" subtitle="Messages and notices in one place." />,
});
