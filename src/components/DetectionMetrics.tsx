import {
    AlertTriangle,
    FolderSearch,
    ShieldAlert,
    Clock3,
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
          change={12}
          icon={FolderSearch}
          trend={[12, 14, 16, 18, 19, 21, total]}
        />
  
        <MetricCard
          label="Critical Findings"
          value={critical}
          change={8}
          icon={ShieldAlert}
          trend={[1, 2, 2, 3, 3, 4, critical]}
        />
  
        <MetricCard
          label="Open Detections"
          value={open}
          change={-5}
          invertChangeColor
          icon={AlertTriangle}
          trend={[8, 7, 7, 6, 5, 4, open]}
        />
  
        <MetricCard
          label="In Review"
          value={review}
          change={3}
          icon={Clock3}
          trend={[0, 1, 1, 2, 2, 2, review]}
        />
      </div>
    );
  }