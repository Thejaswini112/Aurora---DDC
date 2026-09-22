import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileWarning,
  Database,
  Clock,
  ArrowRight,
  FolderLock,
  KeyRound,
  Share2,
} from 'lucide-react';
import { workQueue } from '@/mock-data';
import { formatRelativeTime, formatFull } from '@/utils/format';
import { SectionTitle, SectionWrapper } from './SectionTitle';
import { cn } from '@/lib/utils';
import type { WorkQueueItem, Severity } from '@/types';

const severityStyles: Record<Severity, { bar: string; label: string; chip: string; ring: string }> = {
  critical: {
    bar: 'bg-danger',
    label: 'text-danger',
    chip: 'bg-danger/10 text-danger border-danger/20',
    ring: 'group-hover:shadow-[0_0_0_2px_hsl(var(--danger)/0.15)]',
  },
  high: {
    bar: 'bg-warning',
    label: 'text-warning',
    chip: 'bg-warning/10 text-warning border-warning/20',
    ring: 'group-hover:shadow-[0_0_0_2px_hsl(var(--warning)/0.15)]',
  },
  medium: {
    bar: 'bg-primary',
    label: 'text-primary',
    chip: 'bg-primary/10 text-primary border-primary/20',
    ring: 'group-hover:shadow-[0_0_0_2px_hsl(var(--primary)/0.15)]',
  },
  low: {
    bar: 'bg-success',
    label: 'text-success',
    chip: 'bg-success/10 text-success border-success/20',
    ring: 'group-hover:shadow-[0_0_0_2px_hsl(var(--success)/0.15)]',
  },
};

const reasonIcon: Record<string, typeof FileWarning> = {
  'Publicly Shared': Share2,
  'Contains API Keys': KeyRound,
  'External Share Link': Share2,
  'Contains PAN + Aadhaar': FolderLock,
};

export function WorkQueueSection() {
  const navigate = useNavigate();

  return (
    <SectionWrapper className="mt-10" delay={0.05}>
      <SectionTitle
        eyebrow="Action Required"
        title="Priority Work Queue"
        subtitle="Tasks requiring immediate analyst attention."
        action={
          <span className="hidden rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
            {workQueue.length} items
          </span>
        }
      />

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {workQueue.map((item, i) => (
          <WorkQueueCard
          key={item.id}
          item={item}
          delay={0.08 + i * 0.06}
          onClick={() => navigate('/detections')}
        />
        ))}
      </div>
    </SectionWrapper>
  );
}

function WorkQueueCard({
  item,
  delay,
  onClick,
}: {
  item: WorkQueueItem;
  delay: number;
  onClick: () => void;
}) {
  const styles = severityStyles[item.severity];
  const ReasonIcon = reasonIcon[item.reason] ?? FileWarning;

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      onClick={onClick}
      className={cn(
        'group relative flex w-full items-stretch gap-0 overflow-hidden rounded-xl border border-border bg-card text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated',
        styles.ring,
      )}
    >
      {/* severity bar */}
      <div className={cn('w-1 shrink-0', styles.bar)} />

      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
                  styles.chip,
                )}
              >
                {item.severity}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background-subtle px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {item.reasonTag}
              </span>
            </div>
            <p className="mt-2 truncate text-[15px] font-semibold text-foreground">{item.fileName}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ReasonIcon className="h-3.5 w-3.5" />
              {item.reason}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5" />
            {item.repository}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatRelativeTime(item.detectedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileWarning className="h-3.5 w-3.5" />
            {formatFull(item.affectedAssets)} assets
          </span>
        </div>

        <div className="mt-3.5 flex items-center justify-between border-t border-border pt-3">
          <span className="text-[11px] text-muted-foreground">{item.classification}</span>
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-0.5',
              styles.label,
            )}
          >
            {item.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
