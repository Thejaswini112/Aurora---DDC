import { useMemo, useState } from "react";
import { ScanSearch } from "lucide-react";

import {
  PageContainer,
  PageHeader,
} from "@/components/common";

import { scans as initialScans } from "@/mock-data/scans";
import type { Scan } from "@/mock-data/scans";

import { ScanMetrics } from "./scan-management/components/ScanMetrics";
import { ScanTable } from "./scan-management/components/ScanTable";
import { ScanDrawer } from "./scan-management/components/ScanDrawer";

export function ScanManagementPage() {
  const [scans] = useState(initialScans);

  const [selectedScan, setSelectedScan] =
    useState<Scan | null>(null);

  const metrics = useMemo(() => {
    return {
      total: scans.length,

      running: scans.filter(
        (scan) => scan.status === "Running"
      ).length,

      completed: scans.filter(
        (scan) => scan.status === "Completed"
      ).length,

      failed: scans.filter(
        (scan) => scan.status === "Failed"
      ).length,
    };
  }, [scans]);

  return (
    <PageContainer>
      <PageHeader
        title="Scan Management"
        description="Monitor discovery scans across connected repositories and review scan progress."
        icon={ScanSearch}
      />

      <div className="mt-8 space-y-8">
        <ScanMetrics
          total={metrics.total}
          running={metrics.running}
          completed={metrics.completed}
          failed={metrics.failed}
        />

        <ScanTable
          scans={scans}
          onSelect={setSelectedScan}
        />
      </div>

      <ScanDrawer
        scan={selectedScan}
        open={!!selectedScan}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedScan(null);
          }
        }}
      />
    </PageContainer>
  );
}