import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatNumber } from '@/utils/format';

interface MetricCardProps {
  label: string;
  value: number | string;
  change?: number;
  icon?: LucideIcon;
  trend?: number[];
  suffix?: string;
  className?: string;
  invertChangeColor?: boolean;
}

export function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  trend,
  suffix,
  className,
  invertChangeColor = false,
}: MetricCardProps) {
  const isPositive = (change ?? 0) >= 0;
  const goodChange = invertChangeColor ? !isPositive : isPositive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
            {typeof value === 'number' ? formatNumber(value) : value}
            {suffix && <span className="ml-0.5 text-base font-normal text-muted-foreground">{suffix}</span>}
          </p>
        </div>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background-subtle">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        {typeof change === 'number' ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-medium',
              goodChange ? 'text-success' : 'text-danger',
            )}
          >
            {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(change)}%
            <span className="font-normal text-muted-foreground">vs last week</span>
          </span>
        ) : (
          <span />
        )}
        {trend && trend.length > 1 && <Sparkline data={trend} positive={goodChange} />}
      </div>
    </motion.div>
  );
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-7 w-20">
      <defs>
        <linearGradient id={`spark-${positive ? 'g' : 'r'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? 'hsl(var(--success))' : 'hsl(var(--danger))'} stopOpacity="0.25" />
          <stop offset="100%" stopColor={positive ? 'hsl(var(--success))' : 'hsl(var(--danger))'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,100 ${points} 100,100`}
        fill={`url(#spark-${positive ? 'g' : 'r'})`}
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke={positive ? 'hsl(var(--success))' : 'hsl(var(--danger))'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
