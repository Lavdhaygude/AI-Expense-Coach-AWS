import { AppShell } from "@/components/app-shell";
import { InsightsPanel } from "@/components/insights-panel";

export default function InsightsPage() {
  return (
    <AppShell>
      <section className="panel">
        <InsightsPanel />
      </section>
    </AppShell>
  );
}
