import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Database, Plus, Radar, DatabaseZap } from 'lucide-react';
import { toast } from 'sonner';
import {
  PageContainer,
  PageHeader,
  EmptyState,
  PrimaryButton,
  SecondaryButton,
} from '@/components/common';
import {
  repositories as baseRepositories,
  healthStatusForRepository,
} from '@/mock-data';
import { formatNumber } from '@/utils/format';
import { SummaryCards } from './data-sources/SummaryCards';
import { RepositoryInventory } from './data-sources/RepositoryInventory';
import {
  HealthDonut,
  ConnectorActivityFeed,
  DataSourceRecommendation,
} from './data-sources/RightSidebar';
import {
  RepositoryDrawer,
  type ConnectorEditPayload,
} from './data-sources/RepositoryDrawer';
import { ConnectRepositoryWizard } from './data-sources/ConnectRepositoryWizard';
import type { Repository } from '@/types';

const STORAGE_KEY = 'aurora-connected-repos';
const DISCONNECTED_KEY = 'aurora-disconnected-repos';
const OVERRIDES_KEY = 'aurora-repository-overrides';

function loadConnected(): Repository[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Repository[]) : [];
  } catch {
    return [];
  }
}

function loadDisconnected(): string[] {
  try {
    const raw = localStorage.getItem(DISCONNECTED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function loadOverrides(): Record<string, Partial<Repository>> {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw
      ? (JSON.parse(raw) as Record<string, Partial<Repository>>)
      : {};
  } catch {
    return {};
  }
}

export function DataSourcesPage() {
  const [connectedRepos, setConnectedRepos] = useState<Repository[]>([]);
  const [disconnectedRepoIds, setDisconnectedRepoIds] = useState<string[]>([]);
  const [repoOverrides, setRepoOverrides] = useState<
    Record<string, Partial<Repository>>
  >({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [scanningRepoIds, setScanningRepoIds] = useState<string[]>([]);

  useEffect(() => {
    setConnectedRepos(loadConnected());
    setDisconnectedRepoIds(loadDisconnected());
    setRepoOverrides(loadOverrides());
  }, []);

  const allRepos = useMemo(() => {
    const map = new Map<string, Repository>();

    baseRepositories.forEach((repo) => {
      if (!disconnectedRepoIds.includes(repo.id)) {
        map.set(repo.id, repo);
      }
    });

    connectedRepos.forEach((repo) => {
      if (!disconnectedRepoIds.includes(repo.id)) {
        map.set(repo.id, repo);
      }
    });

    return Array.from(map.values()).map((repo) => ({
      ...repo,
      ...(repoOverrides[repo.id] ?? {}),
      status: scanningRepoIds.includes(repo.id)
        ? 'scanning'
        : repoOverrides[repo.id]?.status ?? repo.status,
    }));
  }, [
    connectedRepos,
    disconnectedRepoIds,
    repoOverrides,
    scanningRepoIds,
  ]);

  const handleRowClick = useCallback((repo: Repository) => {
    setSelectedRepo(repo);
    setDrawerOpen(true);
  }, []);

  const persistOverrides = useCallback(
    (id: string, override: Partial<Repository>) => {
      setRepoOverrides((prev) => {
        const next = {
          ...prev,
          [id]: {
            ...prev[id],
            ...override,
          },
        };

        localStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const startScan = useCallback(
    (repo: Repository) => {
      if (scanningRepoIds.includes(repo.id)) return;

      setScanningRepoIds((prev) => [...prev, repo.id]);
      persistOverrides(repo.id, { status: 'scanning' });

      toast.success(`Scan started for ${repo.name}.`);

      window.setTimeout(() => {
        setScanningRepoIds((prev) => prev.filter((id) => id !== repo.id));

        persistOverrides(repo.id, {
          status: 'active',
          lastScanned: new Date().toISOString(),
        });

        toast.success(`Scan completed for ${repo.name}.`);
      }, 3000);
    },
    [persistOverrides, scanningRepoIds],
  );

  const handleRunScan = useCallback(() => {
    if (!selectedRepo) return;

    const repo = selectedRepo;

    setDrawerOpen(false);
    startScan(repo);
  }, [selectedRepo, startScan]);

  const handleRunAllScans = useCallback(() => {
    if (allRepos.length === 0) {
      toast.error('No repositories are connected.');
      return;
    }

    const availableRepos = allRepos.filter(
      (repo) => !scanningRepoIds.includes(repo.id),
    );

    if (availableRepos.length === 0) {
      toast.info('All repositories are already being scanned.');
      return;
    }

    availableRepos.forEach(startScan);

    toast.success(
      `Discovery scan started for ${availableRepos.length} ${
        availableRepos.length === 1 ? 'repository' : 'repositories'
      }.`,
    );
  }, [allRepos, scanningRepoIds, startScan]);

  const handleEditConnector = useCallback(
    (payload: ConnectorEditPayload) => {
      if (!selectedRepo) return;

      persistOverrides(selectedRepo.id, {
        name: payload.name,
      });

      setConnectedRepos((prev) => {
        const exists = prev.some((repo) => repo.id === selectedRepo.id);

        if (!exists) return prev;

        const next = prev.map((repo) =>
          repo.id === selectedRepo.id
            ? {
                ...repo,
                name: payload.name,
              }
            : repo,
        );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      setSelectedRepo((prev) =>
        prev
          ? {
              ...prev,
              name: payload.name,
            }
          : prev,
      );

      toast.success('Connector updated successfully.');
    },
    [persistOverrides, selectedRepo],
  );

  const handleDisconnect = useCallback(() => {
    if (!selectedRepo) return;

    const repo = selectedRepo;

    setDisconnectedRepoIds((prev) => {
      const next = prev.includes(repo.id)
        ? prev
        : [...prev, repo.id];

      localStorage.setItem(DISCONNECTED_KEY, JSON.stringify(next));
      return next;
    });

    setConnectedRepos((prev) => {
      const next = prev.filter((item) => item.id !== repo.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    setRepoOverrides((prev) => {
      const next = { ...prev };
      delete next[repo.id];
      localStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
      return next;
    });

    setScanningRepoIds((prev) =>
      prev.filter((id) => id !== repo.id),
    );

    setDrawerOpen(false);
    setSelectedRepo(null);

    toast.success(`${repo.name} disconnected successfully.`);
  }, [selectedRepo]);

  const handleConnectComplete = useCallback(
    (repo: Repository) => {
      setDisconnectedRepoIds((prev) => {
        const next = prev.filter((id) => id !== repo.id);
        localStorage.setItem(DISCONNECTED_KEY, JSON.stringify(next));
        return next;
      });

      setConnectedRepos((prev) => {
        const next = [
          ...prev.filter((item) => item.id !== repo.id),
          repo,
        ];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      toast.success(
        `${repo.name} has been added to your inventory and is ready for discovery.`,
      );
    },
    [],
  );

  const summary = useMemo(() => {
    const healthStatuses = allRepos.map((repo) =>
      healthStatusForRepository(repo),
    );

    const healthy = healthStatuses.filter(
      (status) => status === 'healthy',
    ).length;

    const needsAttention = healthStatuses.filter(
      (status) =>
        status === 'needs-attention' || status === 'needs-scan',
    ).length;

    const scanning = healthStatuses.filter(
      (status) => status === 'scanning',
    ).length;

    const totalSensitive = allRepos.reduce(
      (sum, repo) => sum + repo.sensitiveAssets,
      0,
    );

    return {
      connected: allRepos.length,
      healthy,
      needsAttention,
      scanning,
      dataProtected: `${formatNumber(totalSensitive)} Files`,
    };
  }, [allRepos]);

  return (
    <PageContainer>
      <PageHeader
        title="Data Sources"
        description="Manage connected repositories, monitor connector health, and configure discovery coverage across your organization."
        icon={Database}
        actions={
          <>
            <SecondaryButton onClick={handleRunAllScans}>
              <Radar className="mr-1.5 h-4 w-4" />
              Run Scan
            </SecondaryButton>

            <PrimaryButton onClick={() => setWizardOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Connect Repository
            </PrimaryButton>
          </>
        }
      />

      <div className="mt-6 space-y-6">
        <SummaryCards
          connected={summary.connected}
          healthy={summary.healthy}
          needsAttention={summary.needsAttention}
          scanning={summary.scanning}
          dataProtected={summary.dataProtected}
        />

        {allRepos.length === 0 ? (
          <EmptyState
            icon={DatabaseZap}
            title="No repositories connected"
            description="Connect a repository to start discovering and classifying sensitive data."
            action={
              <PrimaryButton onClick={() => setWizardOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" />
                Connect Repository
              </PrimaryButton>
            }
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <RepositoryInventory
              repositories={allRepos}
              onRowClick={handleRowClick}
            />

            <div className="space-y-6">
            <HealthDonut />
              <ConnectorActivityFeed />
              <DataSourceRecommendation />
            </div>
          </div>
        )}
      </div>

      <RepositoryDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        repository={selectedRepo}
        scanning={
          selectedRepo
            ? scanningRepoIds.includes(selectedRepo.id)
            : false
        }
        onRunScan={handleRunScan}
        onEditConnector={handleEditConnector}
        onDisconnect={handleDisconnect}
      />

      <ConnectRepositoryWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onComplete={handleConnectComplete}
      />
    </PageContainer>
  );
}