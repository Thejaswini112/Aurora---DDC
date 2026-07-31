import { scanSettings } from "@/mock-data/settings";
import {
  ScanSearch,
  Cpu,
  Layers3,
  ShieldCheck,
} from "lucide-react";

export default function ScanSettings() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Scanning Configuration
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Configure how Aurora discovers, scans and classifies sensitive data.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">

        <div className="space-y-6">

          {/* Scan Frequency */}

          <SettingRow
            icon={ScanSearch}
            title="Scan Frequency"
            description="How often repositories are scanned."
          >
            <span className="rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {scanSettings.frequency}
            </span>
          </SettingRow>

          {/* Maximum Threads */}

          <SettingRow
            icon={Cpu}
            title="Maximum Scan Threads"
            description="Number of concurrent scan workers."
          >
            <span className="rounded-lg border border-border px-3 py-1 text-sm font-medium">
              {scanSettings.maxThreads}
            </span>
          </SettingRow>

          {/* Incremental */}

          <SettingRow
            icon={Layers3}
            title="Incremental Scan"
            description="Only scan newly added or modified files."
          >
            <Toggle enabled={scanSettings.incrementalScan} />
          </SettingRow>

          {/* Deep Scan */}

          <SettingRow
            icon={ShieldCheck}
            title="Deep Scan"
            description="Inspect archives, binaries and nested documents."
          >
            <Toggle enabled={scanSettings.deepScan} />
          </SettingRow>

        </div>

      </div>
    </section>
  );
}

interface SettingRowProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingRow({
  icon: Icon,
  title,
  description,
  children,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background-subtle p-4">

      <div className="flex items-center gap-4">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h3 className="font-medium">{title}</h3>

          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>

      </div>

      {children}

    </div>
  );
}

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={`flex h-7 w-12 items-center rounded-full transition ${
        enabled ? "bg-primary" : "bg-muted"
      }`}
    >
      <div
        className={`h-5 w-5 rounded-full bg-white transition ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </div>
  );
}