import {
  Edit3,
  Eye,
  MoreHorizontal,
  Pause,
  Play,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Policy } from "@/types";

interface PoliciesTableProps {
  policies: Policy[];
  onStatusChange?: (
    policyId: string,
    status: Policy["status"]
  ) => void;
  onView?: (policy: Policy) => void;
  onEdit?: (policy: Policy) => void;
  onDelete?: (policy: Policy) => void;
}

const statusVariant = {
  enforced: "default",
  draft: "secondary",
  paused: "outline",
} as const;

const severityClass = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

export function PoliciesTable({
  policies,
  onStatusChange,
  onView,
  onEdit,
  onDelete,
}: PoliciesTableProps) {
  if (policies.length === 0) {
    return (
      <div className="rounded-xl border bg-background p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Eye className="h-5 w-5 text-muted-foreground" />
        </div>

        <h3 className="mt-4 text-lg font-semibold">
          No policies found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          No policies match your current search or filters. Try changing your
          filters or clearing them to see all policies.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-background">
      <table className="w-full min-w-[900px]">
        <thead className="border-b bg-muted/40">
          <tr className="text-left text-sm">
            <th className="px-6 py-4 font-medium">Policy</th>
            <th className="px-6 py-4 font-medium">Framework</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Severity</th>
            <th className="px-6 py-4 font-medium">Repositories</th>
            <th className="px-6 py-4 font-medium">Violations</th>
            <th className="px-6 py-4 font-medium">Last Modified</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>

        <tbody>
          {policies.map((policy) => (
            <tr
              key={policy.id}
              className="border-b transition-colors hover:bg-muted/30"
            >
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium">{policy.name}</p>

                  <p className="text-sm text-muted-foreground">
                    {policy.category}
                  </p>
                </div>
              </td>

              <td className="px-6 py-4">
                <Badge variant="outline">{policy.framework}</Badge>
              </td>

              <td className="px-6 py-4">
                <Badge variant={statusVariant[policy.status]}>
                  {policy.status}
                </Badge>
              </td>

              <td className="px-6 py-4">
                <span
                  className={`rounded-md border px-2 py-1 text-xs font-medium ${severityClass[policy.severity]}`}
                >
                  {policy.severity}
                </span>
              </td>

              <td className="px-6 py-4">
                {policy.repositories}
              </td>

              <td className="px-6 py-4">
                {policy.violations === 0 ? (
                  <Badge variant="secondary">0</Badge>
                ) : (
                  <Badge variant="destructive">
                    {policy.violations}
                  </Badge>
                )}
              </td>

              <td className="px-6 py-4 text-sm text-muted-foreground">
                {new Date(policy.lastUpdated).toLocaleDateString()}
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onView?.(policy)}
                    title="View policy"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit?.(policy)}
                    title="Edit policy"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        title="More actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      {policy.status === "enforced" && (
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange?.(policy.id, "paused")
                          }
                        >
                          <Pause className="mr-2 h-4 w-4" />
                          Pause policy
                        </DropdownMenuItem>
                      )}

                      {policy.status === "paused" && (
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange?.(policy.id, "enforced")
                          }
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Enforce policy
                        </DropdownMenuItem>
                      )}

                      {policy.status === "draft" && (
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange?.(policy.id, "enforced")
                          }
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Enforce policy
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete?.(policy)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete policy
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}