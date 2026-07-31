import { motion } from 'framer-motion';
import {
  ScrollText,
  Eye,
  XCircle,
  Radar,
  Plug,
  type LucideIcon,
} from 'lucide-react';
import { briefActivity } from '@/mock-data';
import { formatRelativeTime } from '@/utils/format';
import { SectionTitle, SectionWrapper } from './SectionTitle';
import type { BriefActivityItem } from '@/types';

const typeConfig: Record<
  BriefActivityItem['type'],
  { icon: LucideIcon; color: string; bg: string }
> = {
  policy: { icon: ScrollText, color: 'text-warning', bg: 'bg-warning/10' },
  review: { icon: Eye, color: 'text-primary', bg: 'bg-primary/10' },
  dismiss: { icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted' },
  scan: { icon: Radar, color: 'text-primary', bg: 'bg-primary/10' },
  connect: { icon: Plug, color: 'text-success', bg: 'bg-success/10' },
};

export function ActivitySection() {
  return (
    <SectionWrapper className="mt-10" delay={0.05}>
      <SectionTitle
        eyebrow="Audit Trail"
        title="Recent Activity"
        subtitle="What your team and Aurora have been doing."
      />

      <div className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-card">
        <ol className="relative space-y-0">
          {briefActivity.map((item, i) => (
            <ActivityRow key={item.id} item={item} isLast={i === briefActivity.length - 1} delay={0.1 + i * 0.06} />
          ))}
        </ol>
      </div>
    </SectionWrapper>
  );
}

function ActivityRow({
  item,
  isLast,
  delay,
}: {
  item: BriefActivityItem;
  isLast: boolean;
  delay: number;
}) {
  const config = typeConfig[item.type];
  const Icon = config.icon;

  return (
    <motion.li
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className="relative flex gap-4 pb-6 last:pb-0"
    >
      {!isLast && (
        <div className="absolute left-[19px] top-11 h-[calc(100%-2.75rem)] w-px bg-border" />
      )}

      {/* avatar + icon badge */}
      <div className="relative shrink-0">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: item.color }}
        >
          {item.initials}
        </div>
        <div
          className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card ${config.bg}`}
        >
          <Icon className={`h-2.5 w-2.5 ${config.color}`} />
        </div>
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm text-foreground">
          <span className="font-medium">{item.actor}</span>{' '}
          <span className="text-muted-foreground">{item.action}</span>{' '}
          <span className="font-medium">{item.target}</span>
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{formatRelativeTime(item.timestamp)}</p>
      </div>
    </motion.li>
  );
}
