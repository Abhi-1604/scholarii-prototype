import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/scholarii/ComingSoon";

export const Route = createFileRoute("/app/gradebook")({
  component: () => <ComingSoon title="Gradebook" subtitle="Record and review student grades." />,
});
