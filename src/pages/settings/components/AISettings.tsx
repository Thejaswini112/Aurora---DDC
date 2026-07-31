import { aiSettings } from "@/mock-data/settings";
import {
  BrainCircuit,
  Sparkles,
  FileText,
  SearchCheck,
  BadgeCheck,
} from "lucide-react";

export default function AISettings() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Aurora AI
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Configure AI-powered recommendations, explanations and automated
          intelligence across your workspace.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="space-y-5">

          <Setting
            icon={Sparkles}
            title="AI Recommendations"
            description="Generate remediation recommendations based on findings."
            enabled={aiSettings.recommendations}
          />

          <Setting
            icon={SearchCheck}
            title="Root Cause Analysis"
            description="Explain why sensitive data was detected and its likely origin."
            enabled={aiSettings.rootCauseAnalysis}
          />

          <Setting
            icon={FileText}
            title="Weekly Security Reports"
            description="Automatically generate executive posture summaries."
            enabled={aiSettings.weeklyReports}
          />

          <Setting
            icon={BrainCircuit}
            title="Explain Findings"
            description="Provide natural-language explanations for every detection."
            enabled={aiSettings.explainFindings}
          />

          <div className="rounded-lg border border-border bg-background-subtle p-4">
            <div className="flex items-center justify-between">

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
                {aiSettings.confidenceThreshold}%
              </span>

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
}

function Setting({
  icon: Icon,
  title,
  description,
  enabled,
}: SettingProps) {
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

      <Toggle enabled={enabled} />

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