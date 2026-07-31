import { Sparkles, ArrowRight, Plug, ScanLine, RefreshCw, ScrollText, KeyRound, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { healthDistribution, connectorActivity, dataSourcesRecommendation } from '@/mock-data';
import { formatRelativeTime } from '@/utils/format';
import type { ConnectorActivity as ConnectorActivityType } from '@/types';

const healthData = [
  { name: 'Healthy', value: healthDistribution.healthy, color: 'hsl(var(--success))' },
  { name: 'Needs Attention', value: healthDistribution.needsAttention, color: 'hsl(var(--warning))' },
  { name: 'Scanning', value: healthDistribution.scanning, color: 'hsl(var(--primary))' },
  { name: 'Disconnected', value: healthDistribution.disconnected, color: 'hsl(var(--danger))' },
].filter((d) => d.value > 0);

const total = healthData.reduce((sum, d) => sum + d.value, 0);

const activityIcon: Record<ConnectorActivityType['type'], LucideIcon> = {
  connect: Plug,
  scan: ScanLine,
  sync: RefreshCw,
  policy: ScrollText,
  auth: KeyRound,
};

export function HealthDonut() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Repository Health</h3>
        <span className="text-xs text-muted-foreground">{total} total</span>
      </div>

      <div className="relative mt-4 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={healthData}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={3}
              strokeWidth={0}
            >
              {healthData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-foreground">{total}</span>
          <span className="text-[11px] text-muted-foreground">Repositories</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {healthData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="text-xs font-semibold tabular-nums text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConnectorActivityFeed() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="text-sm font-semibold text-foreground">Recent Connector Activity</h3>
      <ol className="mt-4 space-y-0">
        {connectorActivity.map((item, i) => {
          const Icon = activityIcon[item.type];
          const isLast = i === connectorActivity.length - 1;
          return (
            <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
              {!isLast && (
                <div className="absolute left-[13px] top-7 h-[calc(100%-1.5rem)] w-px bg-border" />
              )}
              <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background-subtle">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-xs text-foreground">
                  <span className="font-medium capitalize">{item.action}</span>{' '}
                  <span className="text-muted-foreground">{item.target}</span>
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                  {formatRelativeTime(item.timestamp)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function DataSourceRecommendation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-card p-5 shadow-card"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Aurora AI
          </span>
        </div>

        <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground">
          {dataSourcesRecommendation.title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {dataSourcesRecommendation.reason}
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-muted-foreground">Confidence</span>
            <span className="font-semibold tabular-nums text-foreground">
              {dataSourcesRecommendation.confidence}%
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dataSourcesRecommendation.confidence}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>

        <button className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-hover">
          {dataSourcesRecommendation.ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
