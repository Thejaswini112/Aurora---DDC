import { useEffect, useMemo, useState } from "react";
import { Filter, Play, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import { PageContainer } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScanDrawer } from "@/pages/scan-management/components/ScanDrawer";
import { CreateScanDialog } from "@/pages/components/CreateScanDialog";
import { ScanMetrics } from "@/pages/scan-management/components/ScanMetrics";
import { ScanTable } from "@/pages/scan-management/components/ScanTable";

import { repositories, scans as initialScans } from "@/mock-data";
import type { Scan } from "@/types";

const SCANS_STORAGE_KEY = "aurora-scans";

function loadScans(): Scan[] {
  try {
    const storedScans = localStorage.getItem(SCANS_STORAGE_KEY);

    if (!storedScans) {
      return initialScans;
    }

    const parsedScans = JSON.parse(storedScans);

    if (!Array.isArray(parsedScans)) {
      return initialScans;
    }

    return parsedScans as Scan[];
  } catch {
    return initialScans;
  }
}

export function ScanManagementPage() {
  const [scans, setScans] = useState<Scan[]>(loadScans);
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [repositoryFilter, setRepositoryFilter] = useState("all");

  useEffect(() => {
    try {
      localStorage.setItem(
        SCANS_STORAGE_KEY,
        JSON.stringify(scans),
      );
    } catch {
      toast.error("Unable to save scan changes", {
        description:
          "Your latest scan changes could not be saved locally.",
      });
    }
  }, [scans]);

  const metrics = useMemo(
    () => ({
      total: scans.length,
      running: scans.filter((scan) => scan.status === "scanning").length,
      completed: scans.filter((scan) => scan.status === "completed").length,
      failed: scans.filter((scan) => scan.status === "failed").length,
    }),
    [scans],
  );

  useEffect(() => {
    const runningScans = scans.filter(
      (scan) => scan.status === "scanning",
    );

    if (runningScans.length === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setScans((currentScans) =>
        currentScans.map((scan) => {
          if (scan.status !== "scanning") {
            return scan;
          }

          const nextProgress = Math.min(scan.progress + 25, 100);
          const completed = nextProgress >= 100;

          const updatedScan: Scan = {
            ...scan,
            progress: nextProgress,
            assetsScanned: Math.round(
              Math.max(scan.assetsScanned, 0) +
                (scan.assetsScanned > 0
                  ? scan.assetsScanned * 0.25
                  : 125),
            ),
            sensitiveFound:
              scan.sensitiveFound +
              (nextProgress === 50 || nextProgress === 75 ? 1 : 0),
            duration: `${Math.max(
              1,
              Math.round(nextProgress / 20),
            )}m`,
            estimatedCompletion: completed
              ? "Completed"
              : `${Math.max(
                  1,
                  Math.ceil((100 - nextProgress) / 25),
                )}m remaining`,
            status: completed ? "completed" : "scanning",
            lastRun: completed
              ? new Date().toLocaleString()
              : scan.lastRun,
          };

          if (selectedScan?.id === scan.id) {
            setSelectedScan(updatedScan);
          }

          if (completed) {
            toast.success("Scan completed", {
              description: `${scan.name} finished successfully.`,
            });
          }

          return updatedScan;
        }),
      );
    }, 2000);

    return () => window.clearInterval(interval);
  }, [scans, selectedScan?.id]);

  const handleCreateScan = (scan: Scan) => {
    setScans((currentScans) => [scan, ...currentScans]);

    toast.success("Scan created", {
      description: `${scan.name} has been added to Scan Management.`,
    });
  };

  const handleStartScan = (scanId: string) => {
    setScans((currentScans) =>
      currentScans.map((scan) =>
        scan.id === scanId
          ? {
              ...scan,
              status: "scanning",
              progress: Math.max(scan.progress, 1),
              startedAt: new Date().toLocaleString(),
              estimatedCompletion: "Calculating...",
              triggeredBy: "You",
            }
          : scan,
      ),
    );

    setSelectedScan((currentScan) =>
      currentScan?.id === scanId
        ? {
            ...currentScan,
            status: "scanning",
            progress: Math.max(currentScan.progress, 1),
            startedAt: new Date().toLocaleString(),
            estimatedCompletion: "Calculating...",
            triggeredBy: "You",
          }
        : currentScan,
    );

    toast.success("Scan started", {
      description: "The scan is now running.",
    });
  };

  const handleStopScan = (scanId: string) => {
    setScans((currentScans) =>
      currentScans.map((scan) =>
        scan.id === scanId
          ? {
              ...scan,
              status: "paused",
              estimatedCompletion: "Paused",
            }
          : scan,
      ),
    );

    setSelectedScan((currentScan) =>
      currentScan?.id === scanId
        ? {
            ...currentScan,
            status: "paused",
            estimatedCompletion: "Paused",
          }
        : currentScan,
    );

    toast("Scan paused", {
      description: "The scan has been paused.",
    });
  };

  const filteredScans = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return scans.filter((scan) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${scan.id} ${scan.name} ${scan.repositoryName} ${scan.type} ${scan.status}`
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || scan.status === statusFilter;

      const matchesType =
        typeFilter === "all" || scan.type === typeFilter;

      const matchesRepository =
        repositoryFilter === "all" ||
        scan.repositoryId === repositoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesRepository
      );
    });
  }, [
    scans,
    searchQuery,
    statusFilter,
    typeFilter,
    repositoryFilter,
  ]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    repositoryFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setRepositoryFilter("all");
  };

  const repositoryOptions = useMemo(() => {
    const repositoryIds = new Set(
      scans.map((scan) => scan.repositoryId),
    );

    return repositories.filter((repository) =>
      repositoryIds.has(repository.id),
    );
  }, [scans]);

  return (
    <PageContainer className="py-8">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Scan Management
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Create, run, monitor, and review discovery scans.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Scan
            </Button>

            <Button
              onClick={() => {
                const scheduledScan = scans.find(
                  (scan) => scan.status === "scheduled",
                );

                if (scheduledScan) {
                  handleStartScan(scheduledScan.id);
                } else {
                  toast("No scheduled scans", {
                    description:
                      "Create or schedule a scan before running one.",
                  });
                }
              }}
            >
              <Play className="mr-2 h-4 w-4" />
              Run Scan
            </Button>
          </div>
        </div>

        <ScanMetrics
          total={metrics.total}
          running={metrics.running}
          completed={metrics.completed}
          failed={metrics.failed}
        />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />

            <p className="text-sm font-medium">
              Filter scans
            </p>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search scans..."
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All statuses
                </SelectItem>
                <SelectItem value="scheduled">
                  Scheduled
                </SelectItem>
                <SelectItem value="scanning">
                  Running
                </SelectItem>
                <SelectItem value="completed">
                  Completed
                </SelectItem>
                <SelectItem value="failed">
                  Failed
                </SelectItem>
                <SelectItem value="paused">
                  Paused
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Scan type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All scan types
                </SelectItem>
                <SelectItem value="full">
                  Full discovery
                </SelectItem>
                <SelectItem value="incremental">
                  Incremental
                </SelectItem>
                <SelectItem value="scheduled">
                  Scheduled
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={repositoryFilter}
              onValueChange={setRepositoryFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Repository" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All repositories
                </SelectItem>

                {repositoryOptions.map((repository) => (
                  <SelectItem
                    key={repository.id}
                    value={repository.id}
                  >
                    {repository.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredScans.length > 0 ? (
          <ScanTable
            scans={filteredScans}
            onSelect={setSelectedScan}
          />
        ) : (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <Search className="mx-auto h-8 w-8 text-muted-foreground" />

            <h3 className="mt-4 text-sm font-semibold">
              No scans found
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {hasActiveFilters
                ? "No scans match the current search and filter combination."
                : "There are no scans available yet."}
            </p>

            {hasActiveFilters ? (
              <Button
                variant="outline"
                className="mt-4"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            ) : (
              <Button
                className="mt-4"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Scan
              </Button>
            )}
          </div>
        )}
      </div>

      <ScanDrawer
        scan={selectedScan}
        open={Boolean(selectedScan)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedScan(null);
          }
        }}
        onStartScan={handleStartScan}
        onStopScan={handleStopScan}
      />

      <CreateScanDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateScan}
      />
    </PageContainer>
  );
}