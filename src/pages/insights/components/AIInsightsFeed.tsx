import { aiInsights } from "@/mock-data/insights";
import {
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

function getSeverityStyles(severity: string) {
  switch (severity) {
    case "Critical":
      return {
        icon: AlertTriangle,
        badge: "bg-red-100 text-red-700 border-red-200",
        iconColor: "text-red-600",
      };

    case "High":
      return {
        icon: ShieldAlert,
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        iconColor: "text-amber-600",
      };

    default:
      return {
        icon: Sparkles,
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        iconColor: "text-blue-600",
      };
  }
}

export default function AIInsightsFeed() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          AI Security Insights
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          AI-generated recommendations based on the latest scan results.
        </p>
      </div>

      <div className="space-y-4">
        {aiInsights.map((insight, index) => {
          const styles = getSeverityStyles(insight.severity);
          const Icon = styles.icon;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.08,
              }}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex flex-1 gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background-subtle">
                    <Icon className={`h-6 w-6 ${styles.iconColor}`} />
                  </div>

                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {insight.title}
                        </h3>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles.badge}`}
                        >
                          {insight.severity}
                        </span>
                      </div>

                      <p className="text-sm leading-6 text-muted-foreground">
                        {insight.description}
                      </p>
                    </div>

                    <div className="rounded-lg bg-muted/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Recommended Action
                      </p>

                      <p className="mt-2 text-sm">
                        {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex w-40 flex-col items-end gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Confidence
                    </p>

                    <p className="text-2xl font-bold">
                      {insight.confidence}%
                    </p>
                  </div>

                  <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                    {insight.action}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}