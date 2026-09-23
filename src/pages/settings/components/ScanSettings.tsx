import { useEffect, useState } from "react";
import {
  Cpu,
  Layers3,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { scanSettings as initialSettings } from "@/mock-data/settings";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STORAGE_KEY = "aurora-scan-settings";

interface ScanSettingsState {
  frequency: string;
  incrementalScan: boolean;
  deepScan: boolean;
  autoRemediation: boolean;
  maxThreads: number;
}

function loadSettings(): ScanSettingsState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return initialSettings;
    }

    const parsed = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object") {
      return initialSettings;
    }

    return {
      ...initialSettings,
      ...parsed,
    };
  } catch {
    return initialSettings;
  }
}

export default function ScanSettings() {
  const [settings, setSettings] =
    useState<ScanSettingsState>(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings),
      );
    } catch {
      toast.error("Unable to save scan settings");
    }
  }, [settings]);

  const updateSetting = <K extends keyof ScanSettingsState>(
    key: K,
    value: ScanSettingsState[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    toast.success("Scan setting updated");
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Scanning Configuration
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Configure how Aurora discovers, scans and classifies
          sensitive data.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="space-y-6">
          <SettingRow
            icon={ScanSearch}
            title="Scan Frequency"
            description="How often repositories are scanned."
          >
            <Select
              value={settings.frequency}
              onValueChange={(value) =>
                updateSetting("frequency", value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Every Hour">
                  Every Hour
                </SelectItem>
                <SelectItem value="Every 6 Hours">
                  Every 6 Hours
                </SelectItem>
                <SelectItem value="Every 12 Hours">
                  Every 12 Hours
                </SelectItem>
                <SelectItem value="Daily">
                  Daily
                </SelectItem>
                <SelectItem value="Weekly">
                  Weekly
                </SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow
            icon={Cpu}
            title="Maximum Scan Threads"
            description="Number of concurrent scan workers."
          >
            <Select
              value={String(settings.maxThreads)}
              onValueChange={(value) =>
                updateSetting("maxThreads", Number(value))
              }
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="24">24</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow
            icon={Layers3}
            title="Incremental Scan"
            description="Only scan newly added or modified files."
          >
            <Switch
              checked={settings.incrementalScan}
              onCheckedChange={(checked) =>
                updateSetting("incrementalScan", checked)
              }
            />
          </SettingRow>

          <SettingRow
            icon={ShieldCheck}
            title="Deep Scan"
            description="Inspect archives, binaries and nested documents."
          >
            <Switch
              checked={settings.deepScan}
              onCheckedChange={(checked) =>
                updateSetting("deepScan", checked)
              }
            />
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
    <div className="flex items-center justify-between gap-6 rounded-lg border border-border bg-background-subtle p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
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