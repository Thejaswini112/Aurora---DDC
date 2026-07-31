import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Database, Plus, Radar, DatabaseZap } from 'lucide-react';
import {
  PageContainer,
  PageHeader,
  EmptyState,
  PrimaryButton,
  SecondaryButton,
} from '@/components/common';
import { repositories as baseRepositories, healthStatusForRepository } from '@/mock-data';
import { formatNumber } from '@/utils/format';
import { useToast } from '@/hooks/use-toast';
import { SummaryCards } from './data-sources/SummaryCards';
import { RepositoryInventory } from './data-sources/RepositoryInventory';
import { HealthDonut, ConnectorActivityFeed, DataSourceRecommendation } from './data-sources/RightSidebar';
import { RepositoryDrawer, type ConnectorEditPayload } from './data-sources/RepositoryDrawer';
import { ConnectRepositoryWizard } from './data-sources/ConnectRepositoryWizard';
import type { Repository } from '@/types';

const STORAGE_KEY = 'aurora-connected-repos';

function loadConnected(): Repository[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Repository[]) : [];
  } catch {
    return [];
  }
}

export function DataSourcesPage() {
  const { toast } = useToast();
  const [connectedRepos, setConnectedRepos] = useState<Repository[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [scanningRepoId, setScanningRepoId] = useState<string | null>(null);
  const [repoOverrides, setRepoOverrides] = useState<Record<string, Partial<Repository>>>({});

  useEffect(() => {
    setConnectedRepos(loadConnected());
  }, []);

  const allRepos = useMemo(() => {
    const map = new Map<string, Repository>();
    [...baseRepositories, ...connectedRepos].forEach((r) => map.set(r.id, r));
    return Array.from(map.values()).map((r) =>
      repoOverrides[r.id] ? { ...r, ...repoOverrides[r.id] } : r,
    );
  }, [connectedRepos, repoOverrides]);

  const handleRowClick = (repo: Repository) => {
    setSelectedRepo(repo);
    setDrawerOpen(true);
  };

  const persistOverride = useCallback((id: string, override: Partial<Repository>) => {
    setRepoOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...override } }));
  }, []);

  const handleRunScan = useCallback(() => {
    if (!selectedRepo) return;
    const repo = selectedRepo;
    setScanningRepoId(repo.id);
    persistOverride(repo.id, { status: 'scanning' });
    setDrawerOpen(false);
    toast({
      title: 'Scan started',
      description: `Scan started for ${repo.name}.`,
    });
    window.setTimeout(() => {
      setScanningRepoId(null);
      persistOverride(repo.id, { status: 'active', lastScanned: new Date().toISOString() });
      toast({ title: 'Scan completed successfully.' });
    }, 3000);
  }, [selectedRepo, persistOverride, toast]);

  const handleEditConnector = useCallback(
    (payload: ConnectorEditPayload) => {
      if (!selectedRepo) return;
      const repo = selectedRepo;
      setConnectedRepos((prev) => {
        const next = prev.map((r) =>
          r.id === repo.id ? { ...r, name: payload.name } : r,
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      persistOverride(repo.id, { name: payload.name });
      setSelectedRepo((prev) => (prev ? { ...prev, name: payload.name } : prev));
      toast({ title: 'Connector updated successfully.' });
    },
    [selectedRepo, persistOverride, toast],
  );

  const handleDisconnect = useCallback(() => {
    if (!selectedRepo) return;
    const repo = selectedRepo;
    setConnectedRepos((prev) => {
      const next = prev.filter((r) => r.id !== repo.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setRepoOverrides((prev) => {
      if (!(repo.id in prev)) return prev;
      const next = { ...prev };
      delete next[repo.id];
      return next;
    });
    setDrawerOpen(false);
    setSelectedRepo(null);
    toast({ title: 'Repository disconnected.' });
  }, [selectedRepo, toast]);

  const handleConnectComplete = useCallback(
    (repo: Repository) => {
      setConnectedRepos((prev) => {
        const next = [...prev.filter((r) => r.id !== repo.id), repo];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      toast({
        title: 'Repository connected',
        description: `${repo.name} has been added to your inventory and is ready for discovery.`,
      });
    },
    [toast],
  );

  const summary = useMemo(() => {
    const healthy = allRepos.filter((r) => healthStatusForRepository(r) === 'healthy').length;
    const needsAttention = allRepos.filter((r) => healthStatusForRepository(r) === 'needs-attention').length;
    const scanning = allRepos.filter((r) => healthStatusForRepository(r) === 'scanning').length;
    const totalSensitive = allRepos.reduce((sum, r) => sum + r.sensitiveAssets, 0);
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
            <SecondaryButton onClick={() => toast({ title: 'Scan queued', description: 'A new discovery scan has been scheduled across all repositories.' })}>
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

      {allRepos.length === 0 ? (
        <EmptyStateSection onConnect={() => setWizardOpen(true)} />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <SummaryCards {...summary} />
          </motion.div>

          <div className="mt-8 grid gap-6 lg:grid-cols-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="lg:col-span-7"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold tracking-tight text-foreground">Repository Inventory</h2>
                <span className="text-xs text-muted-foreground">{allRepos.length} repositories</span>
              </div>
              <RepositoryInventory repositories={allRepos} onRowClick={handleRowClick} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="space-y-4 lg:col-span-3"
            >
              <HealthDonut />
              <ConnectorActivityFeed />
              <DataSourceRecommendation />
            </motion.div>
          </div>
        </>
      )}

      <RepositoryDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        repository={selectedRepo}
        scanning={selectedRepo ? scanningRepoId === selectedRepo.id : false}
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

function EmptyStateSection({ onConnect }: { onConnect: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mt-12"
    >
      <EmptyState
        icon={DatabaseZap}
        title="Connect your first repository"
        description="Connect a data source to begin discovering sensitive organizational data across your cloud, SaaS, and on-prem repositories."
        action={
          <PrimaryButton onClick={onConnect}>
            <Plus className="mr-1.5 h-4 w-4" />
            Connect Repository
          </PrimaryButton>
        }
      />
    </motion.div>
  );
}
