import { workspaceSettings } from "@/mock-data/settings";
import { Building2, Globe2, Clock3, Archive, ShieldCheck } from "lucide-react";

export default function WorkspaceSettings() {
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
            label="Organization"
            value={workspaceSettings.organization}
          />

          <SettingItem
            icon={Globe2}
            label="Region"
            value={workspaceSettings.region}
          />

          <SettingItem
            icon={Clock3}
            label="Timezone"
            value={workspaceSettings.timezone}
          />

          <SettingItem
            icon={Archive}
            label="Retention Policy"
            value={workspaceSettings.retention}
          />

          <SettingItem
            icon={ShieldCheck}
            label="Default Classification"
            value={workspaceSettings.defaultClassification}
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