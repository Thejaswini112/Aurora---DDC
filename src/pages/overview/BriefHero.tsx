import { motion } from 'framer-motion';
import { Sparkles, Clock, ArrowRight, Radar, CheckCircle2, AlertTriangle } from 'lucide-react';
import { morningBrief } from '@/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedNumber } from './AnimatedNumber';
import { cn } from '@/lib/utils';
import type { BriefSummaryPoint } from '@/types';

const toneDot: Record<BriefSummaryPoint['tone'], string> = {
  neutral: 'bg-muted-foreground',
  positive: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-danger',
};

const toneText: Record<BriefSummaryPoint['tone'], string> = {
  neutral: 'text-muted-foreground',
  positive: 'text-success',
  warning: 'text-warning',
  critical: 'text-danger',
};

interface BriefHeroProps {
  onPrimary: () => void;
  onSecondary: () => void;
}

export function BriefHero({ onPrimary, onSecondary }: BriefHeroProps) {
  const { user, workspace } = useAuth();
  const firstName = user.name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? `Good Morning, ${firstName}` : hour < 18 ? `Good Afternoon, ${firstName}` : `Good Evening, ${firstName}`;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {greeting}
          <span className="ml-2 inline-block animate-[wave_1.8s_ease-in-out_infinite] origin-[70%_70%]">👋</span>
        </h1>
        <p className="text-[15px] text-muted-foreground">
          Here's what happened across {workspace.name} {morningBrief.period}.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
      >
        {/* gradient backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-primary/5 blur-[90px]" />
        </div>

        <div className="relative grid gap-0 lg:grid-cols-5">
          {/* Summary column */}
          <div className="p-7 lg:col-span-3 lg:p-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Aurora AI Brief</p>
                <p className="text-[11px] text-muted-foreground">Generated 2 min ago · Confidence 96%</p>
              </div>
            </div>

            <ul className="mt-6 space-y-3.5">
              {morningBrief.summaryPoints.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.18 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <span
                    className={cn(
                      'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                      toneDot[point.tone],
                      point.tone === 'critical' && 'animate-pulse',
                    )}
                  />
                  <span className={cn('text-[15px] leading-relaxed', toneText[point.tone])}>{point.text}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                onClick={onPrimary}
                className="group inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary-hover"
              >
                Review Critical Findings
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={onSecondary}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                <Radar className="h-4 w-4 text-muted-foreground" />
                Run New Scan
              </button>
            </div>
          </div>

          {/* Review-time + exposure column */}
          <div className="relative flex flex-col justify-between gap-6 border-t border-border bg-background-subtle/40 p-7 lg:col-span-2 lg:border-l lg:border-t-0 lg:p-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Estimated review time
              </p>
              <div className="mt-2 flex items-baseline gap-1.5">
                <AnimatedNumber value={morningBrief.estimatedReviewMinutes} className="text-4xl font-semibold tabular-nums tracking-tight text-foreground" />
                <span className="text-base font-medium text-muted-foreground">minutes</span>
              </div>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Based on 12 findings at avg. 1.5 min each
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Exposure delta</span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-warning">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    +<AnimatedNumber value={morningBrief.exposureDeltaPct} />%
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${morningBrief.exposureDeltaPct * 8}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full bg-warning"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <StatPill icon={CheckCircle2} label="Scans" value="8/8" tone="success" />
                <StatPill icon={AlertTriangle} label="Critical" value="3" tone="danger" />
                <StatPill icon={Sparkles} label="New" value="12" tone="primary" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string;
  tone: 'success' | 'danger' | 'primary';
}) {
  const tones = {
    success: 'text-success',
    danger: 'text-danger',
    primary: 'text-primary',
  };
  return (
    <div className="rounded-lg border border-border bg-card p-2.5 text-center">
      <Icon className={cn('mx-auto h-3.5 w-3.5', tones[tone])} />
      <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
