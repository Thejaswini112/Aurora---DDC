import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  RiskBadge,
  StatusBadge,
} from "@/components/common";
import type { Detection } from "@/types";

interface DetectionDrawerProps {
  detection: Detection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (analyst: string) => void;
  onRemediate: () => void;
}

const analysts = [
  "Alex Johnson",
  "Emily Carter",
  "Michael Scott",
  "Sarah Wilson",
  "David Miller",
];

export function DetectionDrawer({
  detection,
  open,
  onOpenChange,
  onAssign,
  onRemediate,
}: DetectionDrawerProps) {
  const [selectedAnalyst, setSelectedAnalyst] = useState("");

  if (!detection) return null;

  const assign = () => {
    const analyst =
      selectedAnalyst || detection.assignedTo || analysts[0];

    onAssign(analyst);
  };

  const remediate = () => {
    onRemediate();
    onOpenChange(false);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={detection.title}
      description={detection.repositoryName}
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <select
              value={selectedAnalyst}
              onChange={(e) =>
                setSelectedAnalyst(e.target.value)
              }
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
            >
              <option value="">Select analyst</option>

              {analysts.map((analyst) => (
                <option key={analyst} value={analyst}>
                  {analyst}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              onClick={assign}
            >
              Assign Analyst
            </Button>
          </div>

          <Button onClick={remediate}>
            Mark Remediated
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex gap-2">
          <RiskBadge severity={detection.severity} />
          <StatusBadge status={detection.status} />
        </div>

        <section>
          <h3 className="mb-2 text-sm font-semibold">
            Description
          </h3>

          <p className="text-sm text-muted-foreground">
            {detection.description}
          </p>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <Info
            label="Classification"
            value={detection.classification}
          />

          <Info
            label="Affected Assets"
            value={String(detection.affectedAssets)}
          />

          <Info
            label="Detected"
            value={detection.detectedAt}
          />

          <Info
            label="Assigned To"
            value={
              detection.assignedTo ?? "Unassigned"
            }
          />
        </section>

        <section className="rounded-xl border border-border bg-background-subtle p-4">
          <h3 className="mb-3 text-sm font-semibold">
            AI Investigation Summary
          </h3>

          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • Sensitive credentials were detected inside a
              production repository.
            </li>

            <li>
              • Exposure could allow unauthorized access if
              the credentials are active.
            </li>

            <li>
              • Recommended action: rotate credentials
              immediately, revoke old keys, and review
              repository history.
            </li>
          </ul>
        </section>
      </div>
    </Drawer>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium">
        {value}
      </p>
    </div>
  );
}