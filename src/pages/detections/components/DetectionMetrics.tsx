import {
    AlertTriangle,
    Clock3,
    FolderSearch,
    ShieldAlert,
  } from "lucide-react";
  
  import { MetricCard } from "@/components/common";
  
  interface DetectionMetricsProps {
    total: number;
    critical: number;
    open: number;
    review: number;
  }
  
  export function DetectionMetrics({
    total,
    critical,
    open,
    review,
  }: DetectionMetricsProps) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Detections"
          value={total}
          icon={FolderSearch}
          change={12}
          trend={[12, 15, 18, 20, 21, 23, total]}
        />
  
        <MetricCard
          label="Critical Findings"
          value={critical}
          icon={ShieldAlert}
          change={8}
          trend={[1, 2, 2, 3, 3, 4, critical]}
        />
  
        <MetricCard
          label="Open Detections"
          value={open}
          icon={AlertTriangle}
          change={-5}
          invertChangeColor
          trend={[7, 6, 6, 5, 5, 4, open]}
        />
  
        <MetricCard
          label="In Review"
          value={review}
          icon={Clock3}
          change={3}
          trend={[0, 1, 1, 2, 2, 2, review]}
        />
      </div>
    );
  }