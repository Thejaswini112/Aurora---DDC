import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, RiskBadge, StatusBadge } from "@/components/common";
import type { Detection } from "@/types";

interface DetectionTableProps {
  detections: Detection[];
  onSelect?: (detection: Detection) => void;
}

export function DetectionTable({
  detections,
  onSelect,
}: DetectionTableProps) {
  const [search, setSearch] = useState("");

  const filteredDetections = useMemo(() => {
    if (!search.trim()) return detections;

    const q = search.toLowerCase();

    return detections.filter((d) =>
      [
        d.id,
        d.title,
        d.repositoryName,
        d.classification,
        d.severity,
        d.status,
        d.detectedAt,
        String(d.affectedAssets),
        d.assignedTo ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [detections, search]);

  const columns: ColumnDef<Detection>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Detection",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.repositoryName}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "classification",
      header: "Classification",
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => (
        <RiskBadge severity={row.original.severity} />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      accessorKey: "affectedAssets",
      header: "Assets",
    },
    {
      accessorKey: "detectedAt",
      header: "Detected",
    },
  ];

  return (
    <div className="space-y-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search detections..."
        className="h-10 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-primary"
      />

      <DataTable
        columns={columns}
        data={filteredDetections}
        emptyMessage="No detections found."
        onRowClick={onSelect}
      />
    </div>
  );
}