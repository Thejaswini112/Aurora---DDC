import { executiveMetrics } from "@/mock-data/insights";
import { MetricCard } from "@/components/dashboard/MetricCard";

export function ExecutiveSummary() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Executive Summary
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Key security posture indicators across your organization's data
          sources.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {executiveMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            label={metric.label}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            trend={metric.trend}
            invertChangeColor={metric.label === "Estimated Remediation"}
          />
        ))}
      </div>
    </section>
  );
}

export default ExecutiveSummary;