import { useMemo } from "react";
import {
  Archive,
  Building2,
  Clock3,
  Globe2,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { workspaceSettings } from "@/mock-data/settings";

export default function WorkspaceSettings() {
  const { workspace } = useAuth();

  const settings = useMemo(
    () => ({
      organization: workspace.name,
      region: workspace.region,
      timezone: workspaceSettings.timezone,
      retention: workspaceSettings.retention,
      defaultClassification:
        workspaceSettings.defaultClassification,
    }),
    [workspace],
  );

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Workspace Settings
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Configure organization-wide defaults for your Aurora workspace.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="grid gap-6 md:grid-cols-2">
          <SettingItem
            icon={Building2}
            label="Workspace"
            value={settings.organization}
          />

          <SettingItem
            icon={Globe2}
            label="Region"
            value={settings.region}
          />

          <SettingItem
            icon={Clock3}
            label="Timezone"
            value={settings.timezone}
          />

          <SettingItem
            icon={Archive}
            label="Retention Policy"
            value={settings.retention}
          />

          <SettingItem
            icon={ShieldCheck}
            label="Default Classification"
            value={settings.defaultClassification}
          />

          <SettingItem
            icon={Building2}
            label="Plan"
            value={workspace.plan}
          />
        </div>
      </div>
    </section>
  );
}

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function SettingItem({
  icon: Icon,
  label,
  value,
}: SettingItemProps) {
  return (
    <div className="rounded-lg border border-border bg-background-subtle p-4 transition-colors hover:bg-muted/40">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 font-medium text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}