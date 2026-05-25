import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/classes")({
  component: () => <ComingSoon title="My Classes" subtitle="Manage classes you teach." />,
});
