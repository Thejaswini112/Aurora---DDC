import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Policy } from "@/types";
import { Eye } from "lucide-react";

interface PoliciesTableProps {
  policies: Policy[];
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

export function PoliciesTable({ policies }: PoliciesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      <table className="w-full">
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

              <td className="px-6 py-4 text-muted-foreground">
                {policy.lastUpdated}
              </td>

              <td className="px-6 py-4 text-right">
                <Button size="icon" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}