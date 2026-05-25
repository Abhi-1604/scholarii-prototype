import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/children")({
  component: () => <ComingSoon title="My Children" subtitle="Profiles of your enrolled children." />,
});
