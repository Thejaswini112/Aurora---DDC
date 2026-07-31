import {
    Drawer,
  } from "@/components/common";
  
  import type { Scan } from "@/mock-data/scans";
  
  import {
    Database,
    ShieldCheck,
    Clock3,
    Search,
    AlertTriangle,
    CheckCircle2,
    PlayCircle,
    TimerReset,
    FileSearch,
    BarChart3,
    User,
    CalendarClock,
  } from "lucide-react";
  
  import { Button } from "@/components/ui/button";
  import { Progress } from "@/components/ui/progress";
  import { Badge } from "@/components/ui/badge";
  
  interface ScanDrawerProps {
    scan: Scan | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
  
  const STATUS = {
    Running: {
      icon: PlayCircle,
      color: "text-primary",
      badge: "default" as const,
      title: "Scan in Progress",
      description:
        "Aurora is actively discovering sensitive assets. Findings will appear as the scan progresses.",
    },
  
    Completed: {
      icon: CheckCircle2,
      color: "text-success",
      badge: "secondary" as const,
      title: "Scan Completed",
      description:
        "The scan completed successfully. All findings have been indexed and are available for investigation.",
    },
  
    Failed: {
      icon: AlertTriangle,
      color: "text-danger",
      badge: "destructive" as const,
      title: "Scan Failed",
      description:
        "The scan terminated before completion. Review the connector health and restart the scan.",
    },
  
    Queued: {
      icon: TimerReset,
      color: "text-warning",
      badge: "outline" as const,
      title: "Waiting to Start",
      description:
        "This scan has been queued and will automatically begin when compute resources become available.",
    },
  };
  
  export function ScanDrawer({
    scan,
    open,
    onOpenChange,
  }: ScanDrawerProps) {
    if (!scan) return null;
  
    const status = STATUS[scan.status];
    const StatusIcon = status.icon;
  
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        title={scan.name}
        description={scan.repository}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
  
            {scan.status === "Running" && (
              <Button variant="destructive">
                Stop Scan
              </Button>
            )}
  
            {scan.status === "Queued" && (
              <Button>
                Start Scan
              </Button>
            )}
          </>
        }
      >
        <div className="space-y-8">
  
          {/* Status Banner */}
  
          <div className="rounded-xl border bg-muted/30 p-5">
  
            <div className="flex items-start justify-between">
  
              <div className="flex gap-4">
  
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <StatusIcon className={`h-6 w-6 ${status.color}`} />
                </div>
  
                <div>
  
                  <h3 className="text-lg font-semibold">
                    {status.title}
                  </h3>
  
                  <p className="mt-1 text-sm text-muted-foreground">
                    {status.description}
                  </p>
  
                </div>
  
              </div>
  
              <Badge variant={status.badge}>
                {scan.status}
              </Badge>
  
            </div>
  
            <div className="mt-6">
  
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">
                  {scan.progress}%
                </span>
              </div>
  
              <Progress value={scan.progress} />
  
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>
                  Started {scan.startedAt}
                </span>
  
                <span>
                  ETA {scan.estimatedCompletion}
                </span>
              </div>
  
            </div>
  
          </div>
  
          {/* Statistics */}
  
          <section>
  
            <h3 className="mb-4 text-base font-semibold">
              Scan Statistics
            </h3>
  
            <div className="grid grid-cols-2 gap-4">
  
              <StatCard
                icon={Database}
                title="Assets Scanned"
                value={scan.assetsScanned.toLocaleString()}
              />
  
              <StatCard
                icon={ShieldCheck}
                title="Sensitive Findings"
                value={scan.findings.toString()}
              />
  
              <StatCard
                icon={Search}
                title="Scan Type"
                value={scan.type}
              />
  
              <StatCard
                icon={Clock3}
                title="Progress"
                value={`${scan.progress}%`}
              />
  
            </div>
  
          </section>
  
          {/* Repository Details */}
  
          <section>
  
            <h3 className="mb-4 text-base font-semibold">
              Repository Information
            </h3>
  
            <div className="rounded-xl border">
  
              <InfoRow
                icon={Database}
                label="Repository"
                value={scan.repository}
              />
  
              <InfoRow
                icon={User}
                label="Initiated By"
                value={scan.initiatedBy}
              />
  
              <InfoRow
                icon={CalendarClock}
                label="Last Run"
                value={scan.lastRun}
              />
  
              <InfoRow
                icon={Clock3}
                label="Estimated Completion"
                value={scan.estimatedCompletion}
              />
  
            </div>
  
          </section>

                  {/* Activity Timeline */}

        <section>
          <h3 className="mb-4 text-base font-semibold">
            Recent Activity
          </h3>

          <div className="space-y-4 rounded-xl border p-4">

            <TimelineItem
              title="Scan initiated"
              subtitle={`Started by ${scan.initiatedBy}`}
            />

            <TimelineItem
              title={`${scan.assetsScanned.toLocaleString()} assets processed`}
              subtitle="Discovery engine is indexing repository contents."
            />

            <TimelineItem
              title={`${scan.findings} sensitive findings detected`}
              subtitle="Classified using Aurora's detection engine."
            />

            <TimelineItem
              title={`Current status: ${scan.status}`}
              subtitle="Latest execution state."
              last
            />

          </div>
        </section>

        {/* AI Recommendation */}

        <section>
          <h3 className="mb-4 text-base font-semibold">
            AI Recommendation
          </h3>

          <div className="rounded-xl border bg-primary/5 p-5">

            <div className="mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />

              <h4 className="font-medium">
                Suggested Next Action
              </h4>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {scan.findings === 0
                ? "No sensitive information was detected. Consider scheduling recurring scans to continuously monitor this repository."
                : `Aurora recommends reviewing the ${scan.findings} discovered finding${
                    scan.findings > 1 ? "s" : ""
                  } and creating remediation policies if they contain regulated data.`}
            </p>

          </div>
        </section>

        {/* Recommended Actions */}

        <section>
          <h3 className="mb-4 text-base font-semibold">
            Quick Actions
          </h3>

          <div className="grid gap-3">

            <Button
              variant="outline"
              className="justify-start"
            >
              <FileSearch className="mr-2 h-4 w-4" />
              View Findings
            </Button>

            <Button
              variant="outline"
              className="justify-start"
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Create Policy
            </Button>

            <Button
              variant="outline"
              className="justify-start"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Download Report
            </Button>

          </div>
        </section>

      </div>
    </Drawer>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
}

function StatCard({
  icon: Icon,
  title,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-xl border p-4 transition-colors hover:bg-muted/40">

      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>

      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {title}
      </p>

      <p className="mt-1 text-xl font-semibold">
        {value}
      </p>

    </div>
  );
}

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-between border-b px-5 py-4 last:border-0">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <span className="text-sm text-muted-foreground">
          {label}
        </span>

      </div>

      <span className="font-medium">
        {value}
      </span>

    </div>
  );
}

interface TimelineItemProps {
  title: string;
  subtitle: string;
  last?: boolean;
}

function TimelineItem({
  title,
  subtitle,
  last = false,
}: TimelineItemProps) {
  return (
    <div className="flex gap-4">

      <div className="flex flex-col items-center">

        <div className="h-3 w-3 rounded-full bg-primary" />

        {!last && (
          <div className="mt-1 h-full w-px bg-border" />
        )}

      </div>

      <div className="pb-4">

        <p className="font-medium">
          {title}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {subtitle}
        </p>

      </div>

    </div>
  );
}