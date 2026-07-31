import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable, StatusBadge } from "@/components/common";
import { SearchInput } from "@/components/common/SearchInput";


import type { Scan } from "@/mock-data/scans";
import type { EntityStatus } from "@/types";
interface ScanTableProps {
  scans: Scan[];
  onSelect?: (scan: Scan) => void;
}

function badgeStatus(status: Scan["status"]): EntityStatus {
  switch (status) {
    case "Queued":
      return "pending";

    case "Completed":
      return "completed";

    case "Failed":
      return "failed";

    case "Running":
    default:
      return "scanning";
  }
}

export function ScanTable({
  scans,
  onSelect,
}: ScanTableProps) {
  const [search, setSearch] = useState("");

  const filteredScans = useMemo(() => {
    if (!search.trim()) return scans;

    const q = search.toLowerCase();

    return scans.filter((scan) =>
      [
        [
          scan.id,
          scan.name,
          scan.repository,
          scan.status,
          scan.initiatedBy,
          scan.startedAt,
          scan.assetsScanned,
          scan.findings,
        ]
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [search, scans]);

  const columns: ColumnDef<Scan>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Scan",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.name}
          </p>

          <p className="text-xs text-muted-foreground">
          {row.original.repository}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={badgeStatus(
            row.original.status
          )}
        />
      ),
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = row.original.progress;

        return (
          <div className="min-w-[150px]">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>{progress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "assetsScanned",
      header: "Assets",
    },
    {
      accessorKey: "findings",
      header: "Sensitive",
    },
    {
      accessorKey: "initiatedBy",
      header: "Triggered By",
    },
    {
      accessorKey: "estimatedCompletion",
      header: "Duration",
    },
  ];

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onSearch={setSearch}
        placeholder="Search scans..."
      />

      <DataTable
        columns={columns}
        data={filteredScans}
        emptyMessage="No scans found."
        onRowClick={onSelect}
      />
    </div>
  );
}