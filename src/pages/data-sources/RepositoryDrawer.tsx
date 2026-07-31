import { useState } from 'react';
import {
  Database,
  User,
  Link2,
  Calendar,
  Clock,
  Gauge,
  ShieldAlert,
  Radar,
  Pencil,
  Trash2,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  ScrollText,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import { Drawer } from '@/components/common';
import { RiskBadge } from '@/components/common';
import { repositoryDetails } from '@/mock-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  formatRelativeTime,
  formatDateTime,
  formatDate,
  formatFull,
  riskScoreColor,
  riskScoreBg,
} from '@/utils/format';
import {
  repoTypeIcon,
  repoTypeLabel,
  connectorHealthConfig,
} from './repositoryHelpers';
import { cn } from '@/lib/utils';
import type { Repository, RepositoryDetail, RepositoryActivityEvent, RepositoryFinding, ConnectorHealth, ClassificationBreakdown } from '@/types';

export interface ConnectorEditPayload {
  name: string;
  connectionUrl: string;
  authMethod: string;
  scanSchedule: string;
}

interface RepositoryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repository: Repository | null;
  scanning: boolean;
  onRunScan: () => void;
  onEditConnector: (payload: ConnectorEditPayload) => void;
  onDisconnect: () => void;
}

const activityTypeIcon: Record<RepositoryActivityEvent['type'], LucideIcon> = {
  permission: KeyRound,
  scan: Radar,
  sync: RefreshCw,
  policy: ScrollText,
  connect: Database,
  auth: KeyRound,
};

export function RepositoryDrawer({
  open,
  onOpenChange,
  repository,
  scanning,
  onRunScan,
  onEditConnector,
  onDisconnect,
}: RepositoryDrawerProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editAuth, setEditAuth] = useState('OAuth 2.0');
  const [editSchedule, setEditSchedule] = useState('Daily');

  if (!repository) return null;

  const detail = repositoryDetails[repository.id];
  const Icon = repoTypeIcon[repository.type];
  const healthConfig = detail ? connectorHealthConfig[detail.connection] : null;

  const openEdit = () => {
    setEditName(repository.name);
    setEditUrl(detail?.connectionMethod ?? '');
    setEditAuth(detail?.connectionMethod ?? 'OAuth 2.0');
    setEditSchedule(detail?.scanSchedule.frequency ?? 'Daily');
    setEditOpen(true);
  };

  const handleSave = () => {
    onEditConnector({ name: editName, connectionUrl: editUrl, authMethod: editAuth, scanSchedule: editSchedule });
    setEditOpen(false);
  };

  const handleDisconnect = () => {
    setDisconnectOpen(false);
    onDisconnect();
  };

  return (
    <>
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={repository.name}
      description={`${repoTypeLabel[repository.type]} · ${repository.region}`}
      width="sm:max-w-[480px]"
      footer={
        <>
          <button onClick={openEdit} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <Pencil className="h-3.5 w-3.5" />
            Edit Connector
          </button>
          <button onClick={() => setDisconnectOpen(true)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-danger transition-colors hover:bg-danger/5">
            <Trash2 className="h-3.5 w-3.5" />
            Disconnect
          </button>
          <button onClick={onRunScan} disabled={scanning} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-60">
            {scanning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Radar className="h-3.5 w-3.5" />}
            {scanning ? 'Scanning…' : 'Run Scan'}
          </button>
        </>
      }
    >
      <div className="space-y-7">
        <SummarySection repository={repository} detail={detail} Icon={Icon} healthConfig={healthConfig} />
        {detail && healthConfig && <HealthSection repository={repository} detail={detail} healthConfig={healthConfig} />}
        {detail && <ScheduleSection detail={detail} />}
        {detail && <FindingsSection findings={detail.topFindings} />}
        {detail && <DrawerActivitySection events={detail.activity} />}
      </div>
    </Drawer>

    {/* Edit Connector modal */}
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold tracking-tight">Edit Connector</DialogTitle>
          <DialogDescription>Update connection details for {repository.name}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <Field label="Repository Name">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </Field>
          <Field label="Connection URL">
            <input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </Field>
          <Field label="Authentication Method">
            <select
              value={editAuth}
              onChange={(e) => setEditAuth(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>OAuth 2.0</option>
              <option>Service Account</option>
              <option>IAM Role</option>
              <option>Access Key</option>
              <option>Connection String</option>
              <option>SAS Token</option>
            </select>
          </Field>
          <Field label="Scan Schedule">
            <select
              value={editSchedule}
              onChange={(e) => setEditSchedule(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Paused</option>
            </select>
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={() => setEditOpen(false)}
            className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!editName.trim()}
            className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </DialogContent>
    </Dialog>

    {/* Disconnect confirmation */}
    <AlertDialog open={disconnectOpen} onOpenChange={setDisconnectOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold tracking-tight">Disconnect Repository?</AlertDialogTitle>
          <AlertDialogDescription>
            Aurora will stop scanning this repository until it is reconnected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDisconnect}
            className="bg-danger text-danger-foreground hover:bg-danger/90"
          >
            Disconnect
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

function SummarySection({
  repository,
  detail,
  Icon,
  healthConfig,
}: {
  repository: Repository;
  detail: RepositoryDetail | undefined;
  Icon: LucideIcon;
  healthConfig: typeof connectorHealthConfig[ConnectorHealth] | null;
}) {
  return (
    <section>
      <SectionLabel icon={Database}>Repository Summary</SectionLabel>
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-background-subtle/50 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{repository.name}</p>
          <p className="text-xs text-muted-foreground">{repoTypeLabel[repository.type]}</p>
        </div>
        {healthConfig && (
          <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', healthConfig.classes)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', healthConfig.dot)} />
            {healthConfig.label}
          </span>
        )}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
        <SummaryItem icon={User} label="Owner" value={repository.owner} />
        <SummaryItem icon={Link2} label="Connection" value={detail?.connectionMethod ?? '—'} />
        <SummaryItem icon={Calendar} label="Created" value={detail ? formatDate(detail.createdAt) : '—'} />
        <SummaryItem icon={Clock} label="Last Scan" value={formatRelativeTime(repository.lastScanned)} />
        <SummaryItem icon={Calendar} label="Next Scan" value={detail ? formatDateTime(detail.nextScan) : '—'} />
        <SummaryItem icon={Gauge} label="Avg. Duration" value={detail?.avgScanDuration ?? '—'} />
      </dl>
    </section>
  );
}

function SummaryItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </dt>
      <dd className="truncate text-xs font-medium text-foreground">{value}</dd>
    </div>
  );
}

function HealthSection({
  repository,
  detail,
  healthConfig,
}: {
  repository: Repository;
  detail: RepositoryDetail;
  healthConfig: typeof connectorHealthConfig[ConnectorHealth];
}) {
  return (
    <section>
      <SectionLabel icon={Gauge}>Health</SectionLabel>
      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5">
          <span className="text-xs font-medium text-muted-foreground">Risk Score</span>
          <div className="flex items-center gap-2.5">
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full', riskScoreBg(repository.riskScore))}
                style={{ width: `${repository.riskScore}%` }}
              />
            </div>
            <span className={cn('text-sm font-semibold tabular-nums', riskScoreColor(repository.riskScore))}>
              {repository.riskScore}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5">
          <span className="text-xs font-medium text-muted-foreground">Connection Health</span>
          <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', healthConfig.classes)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', healthConfig.dot)} />
            {healthConfig.label}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5">
          <span className="text-xs font-medium text-muted-foreground">Avg. Scan Duration</span>
          <span className="text-xs font-semibold text-foreground">{detail.avgScanDuration}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5">
          <span className="text-xs font-medium text-muted-foreground">Sensitive Files</span>
          <span className="text-xs font-semibold tabular-nums text-foreground">
            {formatFull(repository.sensitiveAssets)}
          </span>
        </div>

        <div className="rounded-lg border border-border bg-background-subtle/50 p-3.5">
          <p className="mb-2.5 text-[11px] font-medium text-muted-foreground">Classification Breakdown</p>
          <div className="space-y-2">
            {detail.classificationBreakdown.map((c: ClassificationBreakdown) => {
              const max = Math.max(...detail.classificationBreakdown.map((x: ClassificationBreakdown) => x.value));
              return (
                <div key={c.label} className="flex items-center gap-2.5">
                  <span className="w-20 shrink-0 text-xs text-muted-foreground">{c.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(c.value / max) * 100}%`, backgroundColor: c.color }}
                    />
                  </div>
                  <span className="w-12 shrink-0 text-right text-xs font-medium tabular-nums text-foreground">
                    {formatFull(c.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ScheduleSection({ detail }: { detail: RepositoryDetail }) {
  const isPaused = detail.scanSchedule.frequency === 'Paused';
  return (
    <section>
      <SectionLabel icon={Clock}>Scan Schedule</SectionLabel>
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-background-subtle/50 p-4">
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', isPaused ? 'bg-muted' : 'bg-primary/10')}>
          <Radar className={cn('h-4 w-4', isPaused ? 'text-muted-foreground' : 'text-primary')} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            {detail.scanSchedule.frequency} · {detail.scanSchedule.time}
          </p>
          <p className="text-xs text-muted-foreground">
            {isPaused ? 'No scan scheduled' : `Next run: ${formatRelativeTime(detail.nextScan)}`}
          </p>
        </div>
      </div>
    </section>
  );
}

function FindingsSection({ findings }: { findings: RepositoryFinding[] }) {
  if (findings.length === 0) {
    return (
      <section>
        <SectionLabel icon={ShieldAlert}>Top Findings</SectionLabel>
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-success/20 bg-success/5 p-4">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <p className="text-sm text-foreground">No active findings for this repository.</p>
        </div>
      </section>
    );
  }
  return (
    <section>
      <SectionLabel icon={ShieldAlert}>Top Findings</SectionLabel>
      <div className="mt-3 space-y-2">
        {findings.map((finding) => (
          <div
            key={finding.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background-subtle/50 px-3.5 py-2.5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">{finding.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{finding.classification}</p>
            </div>
            <RiskBadge severity={finding.severity} />
          </div>
        ))}
      </div>
    </section>
  );
}

function DrawerActivitySection({ events }: { events: RepositoryActivityEvent[] }) {
  return (
    <section>
      <SectionLabel icon={RefreshCw}>Recent Activity</SectionLabel>
      <ol className="mt-3 space-y-0">
        {events.map((event, i) => {
          const Icon = activityTypeIcon[event.type];
          const isLast = i === events.length - 1;
          return (
            <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
              {!isLast && <div className="absolute left-[13px] top-7 h-[calc(100%-1.5rem)] w-px bg-border" />}
              <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background-subtle">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-xs text-foreground">
                  <span className="font-medium">{event.action}</span>{' '}
                  <span className="text-muted-foreground">{event.target}</span>
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                  {event.actor} · {formatRelativeTime(event.timestamp)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function SectionLabel({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {children}
      </h3>
    </div>
  );
}
