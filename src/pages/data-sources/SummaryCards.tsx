import { motion } from 'framer-motion';
import { Database, CheckCircle2, AlertTriangle, Radar, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardDef {
  label: string;
  value: string;
  icon: typeof Database;
  tone: 'neutral' | 'success' | 'warning' | 'primary';
}

const tones = {
  neutral: 'text-muted-foreground',
  success: 'text-success',
  warning: 'text-warning',
  primary: 'text-primary',
};

const iconBg = {
  neutral: 'bg-muted',
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  primary: 'bg-primary/10',
};

export function SummaryCards({
  connected,
  healthy,
  needsAttention,
  scanning,
  dataProtected,
}: {
  connected: number;
  healthy: number;
  needsAttention: number;
  scanning: number;
  dataProtected: string;
}) {
  const cards: SummaryCardDef[] = [
    { label: 'Connected Repositories', value: String(connected), icon: Database, tone: 'neutral' },
    { label: 'Healthy', value: String(healthy), icon: CheckCircle2, tone: 'success' },
    { label: 'Needs Attention', value: String(needsAttention), icon: AlertTriangle, tone: 'warning' },
    { label: 'Scanning', value: String(scanning), icon: Radar, tone: 'primary' },
    { label: 'Data Protected', value: dataProtected, icon: ShieldCheck, tone: 'success' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover"
        >
          <div className={cn('mb-3 flex h-8 w-8 items-center justify-center rounded-lg', iconBg[card.tone])}>
            <card.icon className={cn('h-4 w-4', tones[card.tone])} />
          </div>
          <p className="text-xl font-semibold tabular-nums tracking-tight text-foreground">{card.value}</p>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
