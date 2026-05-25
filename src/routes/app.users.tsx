import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/users")({
  component: () => <ComingSoon title="User Management" subtitle="Manage all platform users." />,
});
