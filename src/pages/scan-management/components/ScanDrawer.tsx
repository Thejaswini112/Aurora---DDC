import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { detections } from "@/mock-data";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileSearch,
  FolderOpen,
  Pause,
  Play,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Scan } from "@/types";

interface ScanDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scan: Scan | null;
  onStartScan?: (scanId: string) => void;
  onStopScan?: (scanId: string) => void;
}

function getStatusBadge(status: Scan["status"]) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
      );

    case "scanning":
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Running
        </Badge>
      );

    case "scheduled":
      return (
        <Badge variant="outline" className="gap-1">
          <Calendar className="h-3 w-3" />
          Scheduled
        </Badge>
      );

    case "paused":
      return (
        <Badge variant="outline" className="gap-1">
          <Pause className="h-3 w-3" />
          Paused
        </Badge>
      );

    case "failed":
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Failed
        </Badge>
      );

    default:
      return null;
  }
}

export function ScanDrawer({
  open,
  onOpenChange,
  scan,
  onStartScan,
  onStopScan,
}: ScanDrawerProps) {
  const navigate = useNavigate();
  const repositoryDetections = useMemo(
    () =>
      detections.filter(
        (detection) => detection.repositoryId === scan?.repositoryId,
      ),
    [scan?.repositoryId],
  );
  
  const riskSnapshot = useMemo(
    () => ({
      critical: repositoryDetections.filter(
        (detection) => detection.severity === "critical",
      ).length,
      high: repositoryDetections.filter(
        (detection) => detection.severity === "high",
      ).length,
      medium: repositoryDetections.filter(
        (detection) => detection.severity === "medium",
      ).length,
      low: repositoryDetections.filter(
        (detection) => detection.severity === "low",
      ).length,
      affectedAssets: repositoryDetections.reduce(
        (total, detection) => total + detection.affectedAssets,
        0,
      ),
    }),
    [repositoryDetections],
  );

  if (!scan) {
    return null;
  }

  const isRunning = scan.status === "scanning";
  const isScheduled = scan.status === "scheduled";
  const isCompleted = scan.status === "completed";
  const isPaused = scan.status === "paused";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="pr-8">
          <div className="flex items-center gap-2">
            {getStatusBadge(scan.status)}
          </div>

          <SheetTitle className="text-xl">{scan.name}</SheetTitle>

          <SheetDescription>
            Scan details, progress, results, and actions.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 px-6 pb-8">
          {/* Scan Overview */}

          <section>
            <h3 className="mb-4 text-base font-semibold">Scan Overview</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FolderOpen className="h-4 w-4" />
                  Repository
                </div>

                <p className="mt-2 text-sm font-medium">
                  {scan.repositoryName}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  Scan Type
                </div>

                <p className="mt-2 text-sm font-medium capitalize">
                  {scan.type}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created / Started
                </div>

                <p className="mt-2 text-sm font-medium">
                  {scan.startedAt}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last Run
                </div>

                <p className="mt-2 text-sm font-medium">
                  {scan.lastRun}
                </p>
              </div>
            </div>
          </section>

          {/* Progress */}

          <section>
            <h3 className="mb-4 text-base font-semibold">Progress</h3>

            {isScheduled ? (
              <div className="rounded-lg border border-dashed bg-background p-4">
                <p className="text-sm font-medium">Waiting to start</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  This scan is scheduled and will begin when its configured
                  execution window starts.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Overall Progress</span>

                  <span className="font-medium">{scan.progress}%</span>
                </div>

                <Progress value={scan.progress} />

                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Started {scan.startedAt}</span>

                  <span>ETA {scan.estimatedCompletion}</span>
                </div>
              </>
            )}
          </section>

          {/* Scan Statistics */}

          <section>
            <h3 className="mb-4 text-base font-semibold">
              Scan Statistics
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">
                  Assets Scanned
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {scan.assetsScanned.toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">
                  Sensitive Found
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {scan.sensitiveFound.toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Duration</p>

                <p className="mt-2 text-2xl font-semibold">
                  {scan.duration}
                </p>
              </div>
            </div>
          </section>

          {/* Results Summary */}

          {isCompleted && (
            <section>
              <h3 className="mb-4 text-base font-semibold">
                Scan Results
              </h3>

              <div className="rounded-xl border bg-muted/20 p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Result
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      Completed successfully
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Assets analyzed
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {scan.assetsScanned.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Sensitive findings
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {scan.sensitiveFound.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    The scan completed its discovery run. Review the detected
                    findings to investigate exposed or sensitive data.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Repository Details */}

          <section>
            <h3 className="mb-4 text-base font-semibold">
              Repository Details
            </h3>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <FolderOpen className="h-5 w-5 text-muted-foreground" />

                <div>
                  <p className="text-sm font-medium">
                    {scan.repositoryName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Repository connected to this scan
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Activity */}

          <section>
            <h3 className="mb-4 text-base font-semibold">Activity</h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />

                <div>
                  <p className="text-sm font-medium">
                    Scan {scan.status === "scanning" ? "started" : "created"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Triggered by {scan.triggeredBy}
                  </p>
                </div>
              </div>

              {isCompleted && (
                <div className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />

                  <div>
                    <p className="text-sm font-medium">
                      Scan completed
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Discovery finished successfully.
                    </p>
                  </div>
                </div>
              )}
              <div className="mt-4 rounded-xl border bg-background p-5">
  <div className="mb-4">
    <p className="text-sm font-semibold">Repository Risk Snapshot</p>
    <p className="mt-1 text-xs text-muted-foreground">
      Current detections associated with {scan.repositoryName}.
    </p>
  </div>

  <div className="grid gap-3 sm:grid-cols-4">
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">Critical</p>
      <p className="mt-1 text-xl font-semibold">
        {riskSnapshot.critical}
      </p>
    </div>

    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">High</p>
      <p className="mt-1 text-xl font-semibold">
        {riskSnapshot.high}
      </p>
    </div>

    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">Medium</p>
      <p className="mt-1 text-xl font-semibold">
        {riskSnapshot.medium}
      </p>
    </div>

    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">Low</p>
      <p className="mt-1 text-xl font-semibold">
        {riskSnapshot.low}
      </p>
    </div>
  </div>

  <div className="mt-3 rounded-lg border p-3">
    <p className="text-xs text-muted-foreground">
      Affected Assets
    </p>
    <p className="mt-1 text-xl font-semibold">
      {riskSnapshot.affectedAssets.toLocaleString()}
    </p>
  </div>
</div>
              {isPaused && (
                <div className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-muted-foreground" />

                  <div>
                    <p className="text-sm font-medium">Scan paused</p>

                    <p className="text-xs text-muted-foreground">
                      The scan is currently paused.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* AI Recommendation */}

          <section>
            <div className="rounded-xl border bg-muted/20 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <ShieldAlert className="h-4 w-4 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    AI Recommendation
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Review sensitive findings after the scan completes and
                    prioritize high-risk exposures for investigation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}

          {/* Quick Actions */}

<section>
  <h3 className="mb-4 text-base font-semibold">
    Quick Actions
  </h3>

  <div className="grid gap-2">
    {isScheduled && onStartScan && (
      <Button
        className="justify-start"
        onClick={() => onStartScan?.(scan.id)}
      >
        <Play className="mr-2 h-4 w-4" />
        Run Now
      </Button>
    )}

    {isRunning && onStopScan && (
      <Button
        variant="outline"
        className="justify-start"
        onClick={() => onStartScan?.(scan.id)}
      >
        <Pause className="mr-2 h-4 w-4" />
        Pause Scan
      </Button>
    )}

{scan.status === "completed" && (
  <Button
    variant="outline"
    className="w-full justify-start"
    onClick={() => onStartScan?.(scan.id)}
  >
    <Play className="mr-2 h-4 w-4" />
    Run Again
  </Button>
)}

<Button
  variant="outline"
  className="w-full justify-start"
  onClick={() => {
    onOpenChange(false);
    navigate("/detections");
  }}
>
  <FileSearch className="mr-2 h-4 w-4" />
  View Findings
</Button>

<Button
  variant="outline"
  className="w-full justify-start"
  onClick={() => {
    onOpenChange(false);
    navigate("/policies");
  }}
>
  <ShieldAlert className="mr-2 h-4 w-4" />
  View Policies
</Button>

<Button
  variant="outline"
  className="w-full justify-start"
  onClick={() => onOpenChange(false)}
>
  <X className="mr-2 h-4 w-4" />
  Close
</Button>
  </div>
</section>
        </div>
      </SheetContent>
    </Sheet>
  );
}