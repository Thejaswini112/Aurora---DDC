import { useEffect, useState } from "react";
import {
  BadgeCheck,
  BrainCircuit,
  FileText,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { aiSettings as initialSettings } from "@/mock-data/settings";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const STORAGE_KEY = "aurora-ai-settings";

interface AISettingsState {
  recommendations: boolean;
  weeklyReports: boolean;
  rootCauseAnalysis: boolean;
  explainFindings: boolean;
  confidenceThreshold: number;
}

function loadSettings(): AISettingsState {
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

export default function AISettings() {
  const [settings, setSettings] =
    useState<AISettingsState>(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings),
      );
    } catch {
      toast.error("Unable to save AI settings");
    }
  }, [settings]);

  const updateSetting = <K extends keyof AISettingsState>(
    key: K,
    value: AISettingsState[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    toast.success("AI setting updated");
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Aurora AI
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Configure AI-powered recommendations, explanations and
          automated intelligence across your workspace.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="space-y-5">
          <Setting
            icon={Sparkles}
            title="AI Recommendations"
            description="Generate remediation recommendations based on findings."
            enabled={settings.recommendations}
            onChange={(checked) =>
              updateSetting("recommendations", checked)
            }
          />

          <Setting
            icon={SearchCheck}
            title="Root Cause Analysis"
            description="Explain why sensitive data was detected and its likely origin."
            enabled={settings.rootCauseAnalysis}
            onChange={(checked) =>
              updateSetting("rootCauseAnalysis", checked)
            }
          />

          <Setting
            icon={FileText}
            title="Weekly Security Reports"
            description="Automatically generate executive posture summaries."
            enabled={settings.weeklyReports}
            onChange={(checked) =>
              updateSetting("weeklyReports", checked)
            }
          />

          <Setting
            icon={BrainCircuit}
            title="Explain Findings"
            description="Provide natural-language explanations for every detection."
            enabled={settings.explainFindings}
            onChange={(checked) =>
              updateSetting("explainFindings", checked)
            }
          />

          <div className="rounded-lg border border-border bg-background-subtle p-4">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
                  <BadgeCheck className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h3 className="font-medium">
                    Confidence Threshold
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Only surface AI recommendations above this confidence.
                  </p>
                </div>
              </div>

              <span className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                {settings.confidenceThreshold}%
              </span>
            </div>

            <div className="mt-5">
              <Slider
                value={[settings.confidenceThreshold]}
                min={50}
                max={100}
                step={5}
                onValueChange={([value]) =>
                  updateSetting(
                    "confidenceThreshold",
                    value,
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SettingProps {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (checked: boolean) => void;
}

function Setting({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}: SettingProps) {
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

      <Switch
        checked={enabled}
        onCheckedChange={onChange}
      />
    </div>
  );
}