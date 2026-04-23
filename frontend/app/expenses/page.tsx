import { AppShell } from "@/components/app-shell";
import { ExpensesManager } from "@/components/expenses-manager";

export default function ExpensesPage() {
  return (
    <AppShell>
      <ExpensesManager />
    </AppShell>
  );
}
