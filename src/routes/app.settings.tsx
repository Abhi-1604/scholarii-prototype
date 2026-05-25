import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/settings")({
  component: () => <ComingSoon title="Settings" subtitle="Configure your school preferences." />,
});
