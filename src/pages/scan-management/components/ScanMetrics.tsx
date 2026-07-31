import {
    Activity,
    CheckCircle2,
    PlayCircle,
    XCircle,
  } from "lucide-react";
  
  import { MetricCard } from "@/components/common";
  
  interface ScanMetricsProps {
    total: number;
    running: number;
    completed: number;
    failed: number;
  }
  
  export function ScanMetrics({
    total,
    running,
    completed,
    failed,
  }: ScanMetricsProps) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Scans"
          value={total}
          icon={Activity}
          change={8}
          trend={[8, 10, 11, 13, 15, 17, total]}
        />
  
        <MetricCard
          label="Running"
          value={running}
          icon={PlayCircle}
          change={12}
          trend={[1, 1, 2, 2, 3, 2, running]}
        />
  
        <MetricCard
          label="Completed"
          value={completed}
          icon={CheckCircle2}
          change={18}
          trend={[2, 3, 4, 4, 5, 5, completed]}
        />
  
        <MetricCard
          label="Failed"
          value={failed}
          icon={XCircle}
          change={-20}
          invertChangeColor
          trend={[3, 2, 2, 2, 1, 1, failed]}
        />
      </div>
    );
  }