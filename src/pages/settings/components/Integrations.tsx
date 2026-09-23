import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Database,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { integrations as initialIntegrations } from "@/mock-data/settings";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "aurora-integrations";

type Integration = (typeof initialIntegrations)[number];
type StoredIntegration = Omit<Integration, "icon">;

function loadIntegrations(): Integration[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return initialIntegrations;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return initialIntegrations;
    }

    return initialIntegrations.map((initialIntegration) => {
      const savedIntegration = parsed.find(
        (item: StoredIntegration) =>
          item.id === initialIntegration.id,
      );

      if (!savedIntegration) {
        return initialIntegration;
      }

      return {
        ...initialIntegration,
        ...savedIntegration,
        // Always use the real Lucide component from mock data.
        icon: initialIntegration.icon,
      };
    });
  } catch {
    return initialIntegrations;
  }
}

function serializeIntegrations(
  integrations: Integration[],
): StoredIntegration[] {
  return integrations.map(
    ({ icon: _icon, ...integration }) => integration,
  );
}

export default function Integrations() {
  const [integrationList, setIntegrationList] =
    useState<Integration[]>(loadIntegrations);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          serializeIntegrations(integrationList),
        ),
      );
    } catch {
      toast.error("Unable to save integration changes");
    }
  }, [integrationList]);

  const toggleConnection = (id: number) => {
    setIntegrationList((current) =>
      current.map((integration) => {
        if (integration.id !== id) {
          return integration;
        }

        const connecting =
          integration.status !== "Connected";

        toast.success(
          connecting
            ? `${integration.name} connected`
            : `${integration.name} disconnected`,
          {
            description: connecting
              ? "The integration is now available to Aurora."
              : "The integration has been disconnected from Aurora.",
          },
        );

        return {
          ...integration,
          status: connecting
            ? "Connected"
            : "Disconnected",
          health: connecting
            ? "Healthy"
            : "Attention",
          lastSync: connecting
            ? "Just now"
            : integration.lastSync,
        };
      }),
    );
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Integrations
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Connected repositories and cloud services monitored by
          Aurora.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {integrationList.map((integration, index) => {
          const Icon = integration.icon;
          const connected =
            integration.status === "Connected";

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.08,
              }}
              className="rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
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

              <Button
                variant="outline"
                className="mt-6 w-full"
                onClick={() =>
                  toggleConnection(integration.id)
                }
              >
                <Database className="mr-2 h-4 w-4" />

                {connected ? "Disconnect" : "Connect"}
              </Button>
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
          success
            ? "text-success"
            : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}