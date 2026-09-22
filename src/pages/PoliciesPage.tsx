import { useMemo, useState } from "react";
import {
  FileCheck2,
  Plus,
  Search,
  ShieldCheck,
  AlertTriangle,
  ScrollText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MetricCard, Page } from "@/components/common";
import { PoliciesTable } from "@/components/policies/PoliciesTable";
import { policies } from "@/mock-data";

export function PoliciesPage() {
  const [search, setSearch] = useState("");

  const filteredPolicies = useMemo(() => {
    return policies.filter(
      (policy) =>
        policy.name.toLowerCase().includes(search.toLowerCase()) ||
        policy.type.toLowerCase().includes(search.toLowerCase()) ||
        policy.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPolicies = policies.length;

  const activePolicies = policies.filter(
    (policy) => policy.status === "enforced"
  ).length;

  const draftPolicies = policies.filter(
    (policy) => policy.status === "draft"
  ).length;

  const totalViolations = policies.reduce(
    (sum, policy) => sum + policy.violations,
    0
  );

  return (
    <Page className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Policies</h1>

          <p className="mt-2 text-muted-foreground">
            Define governance policies, monitor compliance, and track
            violations across your repositories.
          </p>
        </div>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Policy
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Policies"
          value={totalPolicies}
          icon={ScrollText}
        />

        <MetricCard
          label="Active Policies"
          value={activePolicies}
          icon={ShieldCheck}
        />

        <MetricCard
          label="Draft Policies"
          value={draftPolicies}
          icon={FileCheck2}
        />

        <MetricCard
          label="Violations"
          value={totalViolations}
          icon={AlertTriangle}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search policies..."
          className="pl-9"
        />
      </div>

      {/* Table */}
      <PoliciesTable policies={filteredPolicies} />
    </Page>
  );
}