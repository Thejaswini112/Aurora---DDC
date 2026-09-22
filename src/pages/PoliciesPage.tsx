import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  FileCheck2,
  Plus,
  ScrollText,
  Search,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MetricCard, Page } from "@/components/common";
import { PoliciesTable } from "@/components/policies/PoliciesTable";
import { policies as initialPolicies, repositories } from "@/mock-data";
import type { Policy } from "@/types";

import { PolicyDetailsDrawer } from "./components/PolicyDetailsDrawer.tsx";
import {
  CreatePolicyDialog,
  type CreatePolicyPayload,
} from "./components/CreatePolicyDialog.tsx";

const POLICIES_STORAGE_KEY = "aurora-policies";

function loadPolicies(): Policy[] {
  try {
    const storedPolicies = localStorage.getItem(
      POLICIES_STORAGE_KEY
    );

    if (!storedPolicies) {
      return initialPolicies;
    }

    const parsedPolicies = JSON.parse(storedPolicies);

    if (!Array.isArray(parsedPolicies)) {
      return initialPolicies;
    }

    return parsedPolicies as Policy[];
  } catch {
    return initialPolicies;
  }
}

export function PoliciesPage() {
  const [policyList, setPolicyList] = useState<Policy[]>(
    loadPolicies
  );

  const [search, setSearch] = useState("");

  const [selectedPolicy, setSelectedPolicy] =
    useState<Policy | null>(null);

  const [editingPolicy, setEditingPolicy] =
    useState<Policy | null>(null);

  const [createPolicyOpen, setCreatePolicyOpen] = useState(false);

  const [deletePolicy, setDeletePolicy] =
    useState<Policy | null>(null);

  const [frameworkFilter, setFrameworkFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const [summaryFilter, setSummaryFilter] = useState<
    "all" | "enforced" | "paused" | "draft"
  >("all");

  useEffect(() => {
    try {
      localStorage.setItem(
        POLICIES_STORAGE_KEY,
        JSON.stringify(policyList)
      );
    } catch {
      toast.error("Unable to save policy changes", {
        description:
          "Your latest policy changes could not be saved locally.",
      });
    }
  }, [policyList]);

  const handleStatusChange = (
    policyId: string,
    status: Policy["status"]
  ) => {
    const currentPolicy = policyList.find(
      (policy) => policy.id === policyId
    );

    const updatedAt = new Date().toISOString();

    setPolicyList((currentPolicies) =>
      currentPolicies.map((policy) =>
        policy.id === policyId
          ? {
              ...policy,
              status,
              lastUpdated: updatedAt,
            }
          : policy
      )
    );

    if (selectedPolicy?.id === policyId) {
      setSelectedPolicy((currentPolicy) =>
        currentPolicy
          ? {
              ...currentPolicy,
              status,
              lastUpdated: updatedAt,
            }
          : null
      );
    }

    if (currentPolicy) {
      toast.success(
        status === "enforced"
          ? "Policy enforced"
          : status === "paused"
            ? "Policy paused"
            : "Policy moved to draft",
        {
          description: currentPolicy.name,
        }
      );
    }
  };

  const handleCreatePolicy = (payload: CreatePolicyPayload) => {
    const categoryLabels: Record<string, string> = {
      "data-classification": "Data Classification",
      "access-governance": "Access Governance",
      retention: "Retention",
      encryption: "Encryption",
      dlp: "DLP",
      residency: "Data Residency",
    };

    const newPolicy: Policy = {
      id: `POL-${Date.now()}`,
      name: payload.name,
      description: payload.description,
      framework: payload.framework as Policy["framework"],
      type: payload.type as Policy["type"],
      category: categoryLabels[payload.type] ?? payload.type,
      status: "draft",
      severity: payload.severity as Policy["severity"],
      repositories: payload.repositoryIds.length,
      repositoryIds: payload.repositoryIds,
      violations: 0,
      lastUpdated: new Date().toISOString(),
      owner: payload.owner,
    };

    setPolicyList((currentPolicies) => [
      newPolicy,
      ...currentPolicies,
    ]);

    setCreatePolicyOpen(false);

    toast.success("Policy created successfully", {
      description: `${newPolicy.name} has been created as a draft.`,
    });
  };

  const handleUpdatePolicy = (
    policyId: string,
    payload: CreatePolicyPayload
  ) => {
    const categoryLabels: Record<string, string> = {
      "data-classification": "Data Classification",
      "access-governance": "Access Governance",
      retention: "Retention",
      encryption: "Encryption",
      dlp: "DLP",
      residency: "Data Residency",
    };

    const updatedAt = new Date().toISOString();

    setPolicyList((currentPolicies) =>
      currentPolicies.map((policy) => {
        if (policy.id !== policyId) {
          return policy;
        }

        const repositoryIdsChanged =
          payload.repositoryIds.length > 0;

        return {
          ...policy,
          name: payload.name,
          description: payload.description,
          framework: payload.framework as Policy["framework"],
          type: payload.type as Policy["type"],
          category: categoryLabels[payload.type] ?? payload.type,
          severity: payload.severity as Policy["severity"],
          owner: payload.owner,
          repositories: repositoryIdsChanged
            ? payload.repositoryIds.length
            : policy.repositories,
          repositoryIds: repositoryIdsChanged
            ? payload.repositoryIds
            : policy.repositoryIds,
          lastUpdated: updatedAt,
        };
      })
    );

    if (selectedPolicy?.id === policyId) {
      setSelectedPolicy((currentPolicy) =>
        currentPolicy
          ? {
              ...currentPolicy,
              name: payload.name,
              description: payload.description,
              framework: payload.framework as Policy["framework"],
              type: payload.type as Policy["type"],
              category:
                categoryLabels[payload.type] ?? payload.type,
              severity: payload.severity as Policy["severity"],
              owner: payload.owner,
              repositories:
                payload.repositoryIds.length > 0
                  ? payload.repositoryIds.length
                  : currentPolicy.repositories,
              repositoryIds:
                payload.repositoryIds.length > 0
                  ? payload.repositoryIds
                  : currentPolicy.repositoryIds,
              lastUpdated: updatedAt,
            }
          : null
      );
    }

    setEditingPolicy(null);
    setCreatePolicyOpen(false);

    toast.success("Policy updated successfully", {
      description: payload.name,
    });
  };

  const handleDeletePolicy = () => {
    if (!deletePolicy) {
      return;
    }

    const deletedName = deletePolicy.name;
    const deletedId = deletePolicy.id;

    setPolicyList((currentPolicies) =>
      currentPolicies.filter((policy) => policy.id !== deletedId)
    );

    if (selectedPolicy?.id === deletedId) {
      setSelectedPolicy(null);
    }

    if (editingPolicy?.id === deletedId) {
      setEditingPolicy(null);
    }

    setDeletePolicy(null);

    toast.success("Policy deleted", {
      description: `${deletedName} has been removed.`,
    });
  };

  const openCreatePolicy = () => {
    setEditingPolicy(null);
    setCreatePolicyOpen(true);
  };

  const openEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy);
    setCreatePolicyOpen(true);
  };

  const filteredPolicies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return policyList.filter((policy) => {
      const matchesSearch =
        !query ||
        policy.name.toLowerCase().includes(query) ||
        policy.type.toLowerCase().includes(query) ||
        policy.category.toLowerCase().includes(query) ||
        policy.framework.toLowerCase().includes(query) ||
        policy.status.toLowerCase().includes(query) ||
        policy.severity.toLowerCase().includes(query) ||
        policy.owner.toLowerCase().includes(query) ||
        policy.id.toLowerCase().includes(query);

      const matchesFramework =
        frameworkFilter === "all" ||
        policy.framework === frameworkFilter;

      const matchesStatus =
        statusFilter === "all" ||
        policy.status === statusFilter;

      const matchesSeverity =
        severityFilter === "all" ||
        policy.severity === severityFilter;

      const matchesSummary =
        summaryFilter === "all" ||
        policy.status === summaryFilter;

      return (
        matchesSearch &&
        matchesFramework &&
        matchesStatus &&
        matchesSeverity &&
        matchesSummary
      );
    });
  }, [
    policyList,
    search,
    frameworkFilter,
    statusFilter,
    severityFilter,
    summaryFilter,
  ]);

  const totalPolicies = policyList.length;

  const activePolicies = policyList.filter(
    (policy) => policy.status === "enforced"
  ).length;

  const draftPolicies = policyList.filter(
    (policy) => policy.status === "draft"
  ).length;

  const pausedPolicies = policyList.filter(
    (policy) => policy.status === "paused"
  ).length;

  return (
    <Page className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Policies</h1>

          <p className="mt-2 text-muted-foreground">
            Define governance policies, monitor compliance, and track
            violations across your repositories.
          </p>
        </div>

        <Button onClick={openCreatePolicy}>
          <Plus className="mr-2 h-4 w-4" />
          Create Policy
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          className="text-left"
          onClick={() => setSummaryFilter("all")}
        >
          <MetricCard
            label="Total Policies"
            value={totalPolicies}
            icon={ScrollText}
          />
        </button>

        <button
          type="button"
          className="text-left"
          onClick={() => setSummaryFilter("enforced")}
        >
          <MetricCard
            label="Enforced Policies"
            value={activePolicies}
            icon={ShieldCheck}
          />
        </button>

        <button
          type="button"
          className="text-left"
          onClick={() => setSummaryFilter("paused")}
        >
          <MetricCard
            label="Paused Policies"
            value={pausedPolicies}
            icon={AlertTriangle}
          />
        </button>

        <button
          type="button"
          className="text-left"
          onClick={() => setSummaryFilter("draft")}
        >
          <MetricCard
            label="Draft Policies"
            value={draftPolicies}
            icon={FileCheck2}
          />
        </button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search policies..."
            className="pl-9"
          />
        </div>

        <Select
          value={frameworkFilter}
          onValueChange={setFrameworkFilter}
        >
          <SelectTrigger className="w-full lg:w-[170px]">
            <SelectValue placeholder="Framework" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Frameworks</SelectItem>
            <SelectItem value="PCI-DSS">PCI-DSS</SelectItem>
            <SelectItem value="GDPR">GDPR</SelectItem>
            <SelectItem value="SOC 2">SOC 2</SelectItem>
            <SelectItem value="ISO 27001">ISO 27001</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full lg:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="enforced">Enforced</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={severityFilter}
          onValueChange={setSeverityFilter}
        >
          <SelectTrigger className="w-full lg:w-[150px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {(search ||
          frameworkFilter !== "all" ||
          statusFilter !== "all" ||
          severityFilter !== "all" ||
          summaryFilter !== "all") && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setFrameworkFilter("all");
              setStatusFilter("all");
              setSeverityFilter("all");
              setSummaryFilter("all");
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      <PoliciesTable
        policies={filteredPolicies}
        onStatusChange={handleStatusChange}
        onView={setSelectedPolicy}
        onEdit={openEditPolicy}
        onDelete={setDeletePolicy}
      />

      <PolicyDetailsDrawer
        open={selectedPolicy !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPolicy(null);
          }
        }}
        policy={selectedPolicy}
        onStatusChange={handleStatusChange}
      />

      <CreatePolicyDialog
        open={createPolicyOpen}
        onOpenChange={(open) => {
          setCreatePolicyOpen(open);

          if (!open) {
            setEditingPolicy(null);
          }
        }}
        repositories={repositories}
        onCreate={handleCreatePolicy}
        editingPolicy={editingPolicy}
        onUpdate={handleUpdatePolicy}
      />

      <AlertDialog
        open={deletePolicy !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletePolicy(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete policy?
            </AlertDialogTitle>

            <AlertDialogDescription>
              {deletePolicy
                ? `“${deletePolicy.name}” will be permanently removed from the workspace. This action cannot be undone.`
                : "This policy will be permanently removed from the workspace."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDeletePolicy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Policy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}