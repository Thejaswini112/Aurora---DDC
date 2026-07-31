import { cn } from '@/lib/utils';
import type { EntityStatus, RiskLevel, Severity } from '@/types';

const severityConfig: Record<Severity, { label: string; classes: string; dot: string }> = {
  critical: {
    label: 'Critical',
    classes: 'bg-danger/10 text-danger border-danger/20',
    dot: 'bg-danger',
  },
  high: {
    label: 'High',
    classes: 'bg-warning/10 text-warning border-warning/20',
    dot: 'bg-warning',
  },
  medium: {
    label: 'Medium',
    classes: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary',
  },
  low: {
    label: 'Low',
    classes: 'bg-success/10 text-success border-success/20',
    dot: 'bg-success',
  },
};

export function RiskBadge({ severity, className }: { severity: Severity; className?: string }) {
  const config = severityConfig[severity];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.classes,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}

const riskLevelConfig: Record<RiskLevel, { label: string; classes: string }> = {
  critical: { label: 'Critical', classes: 'bg-danger/10 text-danger border-danger/20' },
  high: { label: 'High', classes: 'bg-warning/10 text-warning border-warning/20' },
  medium: { label: 'Medium', classes: 'bg-primary/10 text-primary border-primary/20' },
  low: { label: 'Low', classes: 'bg-success/10 text-success border-success/20' },
  info: { label: 'Info', classes: 'bg-muted text-muted-foreground border-border' },
};

export function RiskScoreBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const config = riskLevelConfig[level];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.classes,
        className,
      )}
    >
      {config.label}
    </span>
  );
}

const statusConfig: Record<EntityStatus, { label: string; classes: string; dot?: string }> = {
  active: { label: 'Active', classes: 'bg-success/10 text-success border-success/20', dot: 'bg-success' },
  scanning: { label: 'Scanning', classes: 'bg-primary/10 text-primary border-primary/20', dot: 'bg-primary' },
  paused: { label: 'Paused', classes: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground' },
  completed: { label: 'Completed', classes: 'bg-success/10 text-success border-success/20', dot: 'bg-success' },
  failed: { label: 'Failed', classes: 'bg-danger/10 text-danger border-danger/20', dot: 'bg-danger' },
  pending: { label: 'Pending', classes: 'bg-warning/10 text-warning border-warning/20', dot: 'bg-warning' },
  draft: { label: 'Draft', classes: 'bg-muted text-muted-foreground border-border' },
  enforced: { label: 'Enforced', classes: 'bg-success/10 text-success border-success/20', dot: 'bg-success' },
  investigating: { label: 'Investigating', classes: 'bg-warning/10 text-warning border-warning/20', dot: 'bg-warning' },
  remediated: { label: 'Remediated', classes: 'bg-success/10 text-success border-success/20', dot: 'bg-success' },
  open: { label: 'Open', classes: 'bg-danger/10 text-danger border-danger/20', dot: 'bg-danger' },
  in_review: { label: 'In Review', classes: 'bg-primary/10 text-primary border-primary/20', dot: 'bg-primary' },
  closed: { label: 'Closed', classes: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground' },
};

export function StatusBadge({ status, className }: { status: EntityStatus; className?: string }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.classes,
        className,
      )}
    >
      {config.dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', config.dot, status === 'scanning' && 'animate-pulse')} />
      )}
      {config.label}
    </span>
  );
}

export function Badge({
  children,
  className,
  variant = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'primary';
}) {
  const variants: Record<string, string> = {
    default: 'bg-muted text-muted-foreground border-border',
    outline: 'border-border text-foreground bg-transparent',
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    primary: 'bg-primary/10 text-primary border-primary/20',
  };
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}
    >
      {children}
    </span>
  );
}
