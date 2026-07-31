import { ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";

import {
  PageContainer,
  PageHeader,
} from "@/components/common";

import { detections as initialDetections } from "@/mock-data/detections";
import type { Detection } from "@/types";

import { DetectionMetrics } from "./detections/components/DetectionMetrics";
import { DetectionTable } from "./detections/components/DetectionTable";
import { DetectionDrawer } from "./detections/components/DetectionDrawer";

export function DetectionsPage() {
  const [detections, setDetections] = useState(initialDetections);
  const [selectedDetection, setSelectedDetection] =
    useState<Detection | null>(null);

  const metrics = useMemo(() => {
    return {
      total: detections.length,
      critical: detections.filter(
        (d) => d.severity === "critical"
      ).length,
      open: detections.filter(
        (d) => d.status === "open"
      ).length,
      review: detections.filter(
        (d) => d.status === "in_review"
      ).length,
    };
  }, [detections]);

  const handleAssign = (analyst: string) => {
    if (!selectedDetection) return;

    const updated = {
      ...selectedDetection,
      assignedTo: analyst,
    };

    setSelectedDetection(updated);

    setDetections((prev) =>
      prev.map((d) =>
        d.id === updated.id ? updated : d
      )
    );
  };

  const handleRemediate = () => {
    if (!selectedDetection) return;

    const updated = {
      ...selectedDetection,
      status: "closed" as const,
    };

    setSelectedDetection(updated);

    setDetections((prev) =>
      prev.map((d) =>
        d.id === updated.id ? updated : d
      )
    );
  };

  return (
    <PageContainer>
      <PageHeader
        title="Detections"
        description="Review, classify and triage sensitive data findings across connected repositories."
        icon={ShieldAlert}
      />

      <div className="mt-8 space-y-8">
        <DetectionMetrics
          total={metrics.total}
          critical={metrics.critical}
          open={metrics.open}
          review={metrics.review}
        />

        <DetectionTable
          detections={detections}
          onSelect={setSelectedDetection}
        />
      </div>

      <DetectionDrawer
        detection={selectedDetection}
        open={!!selectedDetection}
        onOpenChange={(open) => {
          if (!open) setSelectedDetection(null);
        }}
        onAssign={handleAssign}
        onRemediate={handleRemediate}
      />
    </PageContainer>
  );
}