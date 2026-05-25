import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/infrastructure")({
  component: () => <ComingSoon title="Infrastructure" subtitle="Classrooms, labs, library and more." />,
});
