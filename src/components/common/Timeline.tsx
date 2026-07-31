import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import {
  ShieldAlert,
  Radar,
  ScrollText,
  KeyRound,
  Settings2,
  CheckCircle2,
  type LucideIcon as LucideIconType,
} from 'lucide-react';
import type { ActivityEvent } from '@/types';
import { formatRelativeTime } from '@/utils/format';

const typeConfig: Record<
  ActivityEvent['type'],
  { icon: LucideIcon; color: string; bg: string }
> = {
  detection: { icon: ShieldAlert, color: 'text-danger', bg: 'bg-danger/10' },
  scan: { icon: Radar, color: 'text-primary', bg: 'bg-primary/10' },
  policy: { icon: ScrollText, color: 'text-warning', bg: 'bg-warning/10' },
  access: { icon: KeyRound, color: 'text-chart-5', bg: 'bg-chart-5/10' },
  system: { icon: Settings2, color: 'text-muted-foreground', bg: 'bg-muted' },
  remediation: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
};

export function ActivityItem({ event, className }: { event: ActivityEvent; className?: string }) {
  const config = typeConfig[event.type];
  const Icon = config.icon as LucideIconType;

  return (
    <div className={cn('flex gap-3.5', className)}>
      <div className="relative shrink-0">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', config.bg)}>
          <Icon className={cn('h-4 w-4', config.color)} />
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium text-foreground">{event.title}</p>
        <p className="text-sm text-muted-foreground">{event.description}</p>
        <p className="text-xs text-muted-foreground/80">
          {event.actor} · {formatRelativeTime(event.timestamp)}
        </p>
      </div>
    </div>
  );
}

export function Timeline({ events, className }: { events: ActivityEvent[]; className?: string }) {
  return (
    <div className={cn('space-y-0', className)}>
      {events.map((event, index) => (
        <div key={event.id} className="relative pb-6 last:pb-0">
          {index < events.length - 1 && (
            <div className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-border" />
          )}
          <ActivityItem event={event} />
        </div>
      ))}
    </div>
  );
}
