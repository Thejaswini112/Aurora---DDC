import { integrations } from "@/mock-data/settings";
import {
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Database,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Integrations() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Integrations
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Connected repositories and cloud services monitored by Aurora.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {integrations.map((integration, index) => {
          const Icon = integration.icon;

          const connected = integration.status === "Connected";

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.08,
              }}
              className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background-subtle">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                {connected ? (
                  <CheckCircle2 className="h-6 w-6 text-success" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-warning" />
                )}

              </div>

              <h3 className="mt-5 text-lg font-semibold">
                {integration.name}
              </h3>

              <div className="mt-5 space-y-4">

                <InfoRow
                  label="Status"
                  value={integration.status}
                  success={connected}
                />

                <InfoRow
                  label="Health"
                  value={integration.health}
                />

                <InfoRow
                  label="Repositories"
                  value={integration.repositories.toString()}
                />

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="h-4 w-4" />
                    Last Sync
                  </span>

                  <span className="text-sm font-medium">
                    {integration.lastSync}
                  </span>
                </div>

              </div>

              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background-subtle py-2.5 text-sm font-medium transition hover:bg-muted">
                <Database className="h-4 w-4" />
                Manage Connection
              </button>

            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  success?: boolean;
}

function InfoRow({
  label,
  value,
  success,
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span
        className={`text-sm font-medium ${
          success ? "text-success" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}